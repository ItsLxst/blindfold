import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { updateElo } from "@/lib/elo";

export async function POST(req: Request) {
  const { matchId, winner } = await req.json();

  if (typeof matchId !== "string" || (winner !== "A" && winner !== "B")) {
    return NextResponse.json({ error: "Invalid vote" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query("begin");

    const match = await client.query(
      "select model_a, model_b, winner from matches where id = $1 for update",
      [matchId]
    );

    if (match.rowCount === 0) {
      await client.query("rollback");
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }
    if (match.rows[0].winner) {
      await client.query("rollback");
      return NextResponse.json({ error: "Already voted" }, { status: 409 });
    }

    const { model_a, model_b } = match.rows[0];
    const models = await client.query(
      "select id, name, elo from models where id in ($1, $2) for update",
      [model_a, model_b]
    );
    const a = models.rows.find((m) => m.id === model_a);
    const b = models.rows.find((m) => m.id === model_b);

    const { newA, newB } = updateElo(a.elo, b.elo, winner);

    await client.query(
      "update models set elo = $2, games = games + 1 where id = $1",
      [a.id, newA]
    );
    await client.query(
      "update models set elo = $2, games = games + 1 where id = $1",
      [b.id, newB]
    );
    await client.query("update matches set winner = $2 where id = $1", [matchId, winner]);

    await client.query("commit");

    return NextResponse.json({
      modelA: a.name,
      modelB: b.name,
      eloA: Math.round(newA),
      eloB: Math.round(newB),
    });
  } catch {
    await client.query("rollback");
    return NextResponse.json({ error: "Vote failed" }, { status: 500 });
  } finally {
    client.release();
  }
}
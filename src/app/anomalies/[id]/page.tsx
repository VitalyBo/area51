// app/anomalies/[id]/page.tsx
// Next.js 16: params is now a Promise

import { notFound } from "next/navigation";
import Link from "next/link";
import { getAnomaliesCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Anomaly } from "@/types";
import DangerBadge from "@/components/DangerBadge";
import StatusBadge from "@/components/StatusBadge";
import DeleteButton from "@/components/DeleteButton";

type Props = { params: Promise<{ id: string }> };

export default async function AnomalyDetailPage({ params }: Props) {
  const { id } = await params;

  let anomaly: Anomaly;

  try {
    const col = await getAnomaliesCollection();
    const doc = await col.findOne({ _id: new ObjectId(id) });
    if (!doc) notFound();
    anomaly = { ...doc, _id: doc._id.toString() } as Anomaly;
  } catch {
    notFound();
  }

  const row = (label: string, value: React.ReactNode) => (
    <div className="flex flex-col gap-1 border-b border-zinc-800 py-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">
        {label}
      </span>
      <span className="font-mono text-sm text-zinc-200">{value}</span>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-2 font-mono text-xs text-zinc-600">
        <Link href="/anomalies" className="hover:text-zinc-400">
          Anomalies
        </Link>
        <span>/</span>
        <span className="text-zinc-400">{anomaly.codename}</span>
      </div>

      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-widest text-red-500 uppercase mb-1">
            Anomaly Record
          </p>
          <h1 className="font-mono text-3xl font-bold text-zinc-100">
            {anomaly.codename}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/anomalies/${anomaly._id}/edit`}
            className="rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 font-mono text-xs text-zinc-300 transition hover:border-zinc-500"
          >
            Edit
          </Link>
          <DeleteButton
            id={anomaly._id}
            type="anomalies"
            redirectTo="/anomalies"
          />
        </div>
      </div>

      <p className="mb-6 text-sm text-zinc-400 leading-relaxed border-l-2 border-red-800 pl-4">
        {anomaly.description}
      </p>

      <div className="rounded-sm border border-zinc-800 bg-zinc-900 px-5">
        {row("Danger Level", <DangerBadge level={anomaly.dangerLevel} />)}
        {row(
          "Containment Status",
          <StatusBadge status={anomaly.containmentStatus} />,
        )}
        {row("Sector", anomaly.containmentSector || "—")}
        {row(
          "Discovery Date",
          new Date(anomaly.discoveryDate).toLocaleDateString(),
        )}
        {row(
          "Last Reviewed",
          new Date(anomaly.lastReviewed).toLocaleDateString(),
        )}
        {row("Logged By", anomaly.createdBy)}
      </div>
    </div>
  );
}

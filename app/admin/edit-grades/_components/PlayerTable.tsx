import { Grade, Player } from "@/app/types/types";
import { GRADE_THEME } from "@/app/constants";

type Props = {
  players: Player[];
  selectedIds: Set<string>;
  toggleId: (id: string) => void;
};

export default function PlayerTable({
  players,
  selectedIds,
  toggleId,
}: Props) {
  return (
    <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-50 text-xs text-gray-500">
          <tr>
            <th className="p-3"></th>
            <th className="p-3">Player</th>
            <th className="p-3">Role</th>
            <th className="p-3">Grade</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Price</th>
          </tr>
        </thead>

        <tbody>
          {players.map((p) => (
            <tr
              key={p._id}
              onClick={() => toggleId(p._id)}
              className="border-t cursor-pointer hover:bg-gray-50"
            >
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selectedIds.has(p._id)}
                  onChange={() => toggleId(p._id)}
                />
              </td>

              <td className="p-3 font-semibold">{p.name}</td>
              <td className="p-3">{p.role}</td>

              <td className="p-3">
                <span className={`px-2 py-1 rounded ${GRADE_THEME[p.grade as Grade]}`}>
                  {p.grade}
                </span>
              </td>

              <td className="p-3">{p.status}</td>

              <td className="p-3 text-right font-mono">
                ₹{p.basePrice.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
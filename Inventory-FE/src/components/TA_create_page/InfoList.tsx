export default function InfoList({ data }: { data: object }) {
  return (
    <ul className="flex flex-col gap-3 p-6 text-base">
      {Object.entries(data).map(([key, value]) => (
        <li key={key}>
          <span className="font-bold capitalize">{key}</span>: {value}
        </li>
      ))}
    </ul>
  );
}

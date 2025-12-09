type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function AdminCard({ title, children }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {title && (
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
}

export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm">
      {"success" in message && (
        <div className="bg-green-100 text-green-500 border-green-500 border-l-4 py-2 px-4 rounded-md">
          {message.success}
        </div>
      )}
      {"error" in message && (
        <div className="bg-red-100 text-red-500 border-red-500 border-l-4 py-2 px-4 rounded-md">
          {message.error}
        </div>
      )}
      {"message" in message && (
        <div className="text-foreground border-l-2 px-4">{message.message}</div>
      )}
    </div>
  );
}

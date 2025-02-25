import toast from 'react-hot-toast';

export const confirmDialog = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    toast((t) => (
      <div className="flex flex-col gap-4">
        <p className="text-sm">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            onClick={() => {
              toast.dismiss(t.id);
              resolve(false);
            }}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              toast.dismiss(t.id);
              resolve(true);
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  });
}; 
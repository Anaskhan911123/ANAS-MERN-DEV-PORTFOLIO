const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
    <div className="card w-full max-w-sm p-6">
      <h3 className="text-ink font-bold text-lg mb-1">{title}</h3>
      <p className="text-gray-500 text-sm mb-5">{message}</p>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition">Delete</button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
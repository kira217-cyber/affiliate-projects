const Voucher = () => {
  return (
    <div className="w-full p-4 lg:p-6 bg-white rounded-lg space-y-4">
      <h1 className="text-lg font-semibold">দাবি ভাউচার</h1>
      <form action="" className="flex flex-col gap-2">
        <label htmlFor="">ভাউচার কোড আছে?</label>
        <div className="sm:flex gap-2 space-y-2">
          <input
            type="text"
            className="w-full md:w-80 py-1.5 px-4 rounded-lg border border-gray-300 outline-none"
            placeholder="ভাউচার কোড"
          />
          <button className="w-full sm:w-40 py-2.5 px-10 text-sm text-white bg-blue-500 hover:bg-blue-600 duration-300 rounded-full border whitespace-nowrap">
            আবেদন করুন
          </button>
        </div>
      </form>
      <p className="pt-2 text-base border-t border-gray-300">ভাউচারের বিবরণ</p>
    </div>
  );
};

export default Voucher;

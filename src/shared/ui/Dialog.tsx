import BottomSheet from "./BottomSheet";
import Modal from "./Modal";

export default function Dialog(props: any) {
  return (
    <>
      {/* DESKTOP */}
      <div className="hidden md:block">
        <Modal {...props} />
      </div>

      {/* MOBILE */}
      <div className="md:hidden">
        <BottomSheet {...props} />
      </div>
    </>
  );
}
import BottomSheet from "../../components/utils/BottomSheet";
import Modal from "../../components/utils/Modal";

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
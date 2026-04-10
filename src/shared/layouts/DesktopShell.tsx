import { useState } from "react";
import Sidebar from "../navigation/Sidebar";
import HeaderDesktop from "../../components/utils/HeaderDesktop";
import FooterDesktop from "../../components/utils/FooterDesktop";
import Modal from "../../components/utils/Modal";

export default function DesktopShell({ children }: any) {
  const [collapsed, setCollapsed] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        onOpenModal={() => setOpenModal(true)}
      />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        <HeaderDesktop
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="flex-1 overflow-auto">
          {children}
        </main>

        <FooterDesktop />
      </div>

      {/* MODAL */}
      {openModal && (
        <Modal
          title="Export Data"
          textButton="Export"
          onClose={() => setOpenModal(false)}
        >
          <div>Isi export nanti di sini</div>
        </Modal>
      )}
    </div>
  );
}
import { Delete02Icon, NoteEditIcon } from "hugeicons-react";
import SwipeableItem from "../../../shared/ui/SwipeableItem";
import { getAccountsImg } from "../../../helpers/UI";

export default function ComponentAccountItem({
  row,
  isOpen,
  onOpen,
  onClose,
  onEdit,
  onDelete,
}: any) {
  return (
    <div className="relative overflow-hidden border-b border-slate-50 touch-pan-y">
      <div className="absolute inset-y-0 right-0 flex">
        <div onClick={onEdit} className="w-16 flex items-center justify-center bg-amber-500 text-white cursor-pointer">
          <NoteEditIcon size={22} />
        </div>
        <div onClick={onDelete} className="w-16 flex items-center justify-center bg-red-500 text-white cursor-pointer">
          <Delete02Icon size={22} />
        </div>
      </div>
      <SwipeableItem isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <div className="p-4 bg-white">
          <div className="flex items-center gap-3">
            <img src={getAccountsImg(row.name)} className="w-10 h-10" />
          </div>
        </div>
      </SwipeableItem>
    </div>
  );
}
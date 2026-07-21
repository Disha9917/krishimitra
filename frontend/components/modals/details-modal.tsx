import * as React from "react";
import { Dialog } from "../ui/dialog";

export interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function DetailsModal({ isOpen, onClose, title, children }: DetailsModalProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title}>
      {children}
    </Dialog>
  );
}
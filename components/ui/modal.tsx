"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ModalProps = React.ComponentProps<typeof Dialog> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  contentClassName?: string;
  showCloseButton?: boolean;
  children?: React.ReactNode;
};

function Modal({
  title,
  description,
  footer,
  contentClassName,
  showCloseButton = true,
  children,
  ...dialogProps
}: ModalProps) {
  return (
    <Dialog {...dialogProps}>
      <DialogContent
        className={contentClassName}
        showCloseButton={showCloseButton}
      >
        {(title || description) && (
          <DialogHeader>
            {title ? <DialogTitle>{title}</DialogTitle> : null}
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : null}
          </DialogHeader>
        )}
        {children}
        {footer ? <DialogFooter>{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
}

export {
  Modal,
  Dialog as ModalRoot,
  DialogContent as ModalContent,
  DialogDescription as ModalDescription,
  DialogFooter as ModalFooter,
  DialogHeader as ModalHeader,
  DialogTitle as ModalTitle,
};

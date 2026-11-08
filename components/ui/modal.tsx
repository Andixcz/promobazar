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
  /** Když false, nejde zavřít klikem mimo ani Esc. */
  dismissible?: boolean;
  children?: React.ReactNode;
};

function Modal({
  title,
  description,
  footer,
  contentClassName,
  showCloseButton = true,
  dismissible = true,
  children,
  ...dialogProps
}: ModalProps) {
  return (
    <Dialog {...dialogProps}>
      <DialogContent
        className={contentClassName}
        showCloseButton={dismissible && showCloseButton}
        onPointerDownOutside={
          dismissible ? undefined : (event) => event.preventDefault()
        }
        onInteractOutside={
          dismissible ? undefined : (event) => event.preventDefault()
        }
        onEscapeKeyDown={dismissible ? undefined : (event) => event.preventDefault()}
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

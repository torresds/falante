"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

import { useRouter } from "next/navigation";

interface IProps {
  description?: string;
  title?: string;
  isOpen: boolean;
}

export default function ErrorModal(props: IProps) {
  const router = useRouter();

  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={false}
      isOpen={props.isOpen}
    >
      <ModalContent>
        <ModalHeader>{props.title || "Erro fatal"}</ModalHeader>
        <ModalBody>
          {props.description ||
            "Erro ao se comunicar com o servidor da aplicação, clique no botão abaixo para tentar novamente."}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

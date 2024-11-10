import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useAuthToken } from "@/hooks/useAuthToken";
import axios from "axios";
import React from "react";
import EventAddForm from "./security_form";

interface DashboardDialogProps {}

const AddSecurityPersonModal: React.FC<DashboardDialogProps> = ({}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { token } = useAuthToken();
  async function handleFormSubmit(values: any) {
    try {
      // const userId = getDecodeToken()?.id;
      const response = await axios.post(
        "/security",
        {
          ...values,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        title: "Security Person Added",
        description: "Name: " + response.data.name,
      });
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error adding the security person.",
      });
    }
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button>Add Security Person</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new Security Person</DialogTitle>
          <DialogDescription>
            Fill in the details for the new security person. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <EventAddForm onSubmit={handleFormSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default AddSecurityPersonModal;

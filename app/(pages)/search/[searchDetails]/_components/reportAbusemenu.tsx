import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "react-toastify";
import { reportPost } from "@/app/(pages)/news-feed/api/api";

const reportSchema = z.object({
  reason: z.string().min(1, "Please select a reason."),
  message: z.string().min(1, "Message is required."),
  email: z.string().email("Invalid email format."),
});

type ReportFormData = z.infer<typeof reportSchema>;

const ReportAbuseMenu = ({ id, open, onOpenChange }: { id: number, open:boolean, onOpenChange:Dispatch<SetStateAction<boolean>> }) => {
  const [formData, setFormData] = useState<ReportFormData>({
    reason: "",
    message: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ReportFormData, string>>>({});

  const handleChange = (field: keyof ReportFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const result = reportSchema.safeParse(formData);
    if (!result.success) {
      const newErrors = result.error.flatten().fieldErrors;
      setErrors({
        reason: newErrors.reason?.[0] || "",
        message: newErrors.message?.[0] || "",
        email: newErrors.email?.[0] || "",
      });
      return;
    } else {
      setErrors({});
      const response = await reportPost({
        id,
        reason: formData.reason,
        message: formData.message,
        email: formData.email,
      });

      if (response?.data.code === 201 || response?.data.code === 200) {
        toast.success("Reported Successfully");
        onOpenChange(false);
      }
    }
  };

  
  useEffect(() => {
    if (open) {
      setFormData({
        reason: "",
        message: "",
        email: "",
      });
      setErrors({});
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      
      <DialogContent className="sm:max-w-[600px] px-8 py-8 h-auto">
        <DialogHeader>
          <DialogTitle>Report Abuse</DialogTitle>
          <DialogDescription>
            Please tell us what happened. The more details you provide, the better.
          </DialogDescription>
        </DialogHeader>
        <div>
          <label htmlFor="option" className="block mb-2">
            Select a reason *
          </label>
          <Select value={formData.reason} onValueChange={(value) => handleChange("reason", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Option</SelectLabel>
                <SelectItem value="Violence">Violence</SelectItem>
                <SelectItem value="Impersonation">Impersonation</SelectItem>
                <SelectItem value="Child Safety">Child Safety Concerns</SelectItem>
                <SelectItem value="Nudity">Nudity or Sexual Activity</SelectItem>
                <SelectItem value="Fraud">Fraud/Scam</SelectItem>
                <SelectItem value="Hate Speech">Hate Speech/Discrimination</SelectItem>
                <SelectItem value="Illegal Activity">Illegal Activity</SelectItem>
                <SelectItem value="Underage User">Underage User</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.reason && <p className="text-red-500 text-sm">{errors.reason}</p>}

          <label htmlFor="message" className="block mt-4">
            Type your message here *
          </label>
          <textarea
            id="message"
            name="message"
            className="w-full border p-2 rounded-md"
            placeholder="Type your message here"
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
          />
          {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}

          <label htmlFor="email" className="block mt-4">
            We should send our reply to: *
          </label>
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <div className="mt-4">
            <p>
              By clicking the “Report Abuse” button, you confirm that the information you
              provided is accurate and complete.
            </p>
            <p className="text-[#ff9e1f]">
              Upon submitting this report, Maria Celeste will be blocked.
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild><Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button></DialogClose>
          <Button type="submit" onClick={handleSubmit}>
            Report Abuse
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportAbuseMenu;



import { customAxios } from "@/utils/axios-interceptor";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CiCamera } from "react-icons/ci";
import { MdMail } from "react-icons/md";
import { toast } from "react-toastify";
import Image from "next/image";
import type { ReactNode } from "react";

export interface Message {
  receiverId: number;
  body: string;
  attachments?: File[];
}

interface MessageChatProps {
  id?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
  triggerClassName?: string;
  triggerContent?: ReactNode;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const sendMessage = async (data: Message) => {
  try {
    const formData = new FormData();
    formData.append("receiverId", String(data.receiverId));
    formData.append("body", data.body);

    if (data.attachments?.length) {
      data.attachments.forEach((file) => {
        formData.append("attachment", file);
      });
    }

    const response = await customAxios().post(
      "/mmm/message/sendMessage",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error sending message:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to send message");
  }
};

const MessageChat: React.FC<MessageChatProps> = ({
  id,
  open: openProp,
  onOpenChange,
  hideTrigger = false,
  triggerClassName,
  triggerContent,
}) => {
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const open = openProp ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string>("");

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const selectedFiles: File[] = Array.from(event.target.files);

        const validFiles: File[] = [];
        const rejectedFiles: string[] = [];

        selectedFiles.forEach((file) => {
          if (file.size > MAX_FILE_SIZE) {
            rejectedFiles.push(file.name);
          } else {
            validFiles.push(file);
          }
        });

        if (rejectedFiles.length) {
          setFileError(`Some files are too large: ${rejectedFiles.join(", ")}`);
        } else {
          setFileError("");
        }

        const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
        setImages((prev) => [...prev, ...validFiles]);
        setImagePreviews((prev) => [...prev, ...newPreviews]);
      }
    },
    []
  );

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;
    console.log("image", images);

    setLoading(true);
    try {
      await sendMessage({
        receiverId: id ?? 0,
        body: message,
        attachments: images,
      });

      setMessage("");
      setImages([]);
      setImagePreviews([]);
      setOpen(false);
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error("Failed to send message");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setOpen(true);
            }}
            className={triggerClassName}
          >
            {triggerContent ?? "Message"}
          </div>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px] px-8 py-8 h-auto rounded-2xl border border-border-soft">
        <DialogHeader>
          <DialogTitle className="font-playfair text-maroon text-xl">Send your Message</DialogTitle>
        </DialogHeader>

        <div>
          <textarea
            cols={8}
            rows={8}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your Message here..."
            className="w-full border border-border-soft p-3 rounded-xl text-sm focus:border-maroon/40 focus:outline-none transition-colors duration-200 resize-none"
          ></textarea>

          <p className="text-[#6B6B6B] mt-2 text-xs">
            Sending your first letter in a thread costs 10 credits. Each
            following letter costs 30 credits. It&apos;s free to attach up to 10
            photos to a letter.
          </p>

          {fileError && <p className="text-red-600 mt-2 text-xs">{fileError}</p>}

          {imagePreviews.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-20 h-20">
                  <Image
                    src={preview}
                    alt="preview"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 bg-maroon text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex justify-end gap-3 mt-4">
            <label htmlFor="photoUpload">
              <Button
                className="flex items-center gap-2 bg-white hover:bg-soft-rose text-maroon border border-maroon/30 rounded-lg transition-all duration-200"
                asChild
              >
                <span>
                  <CiCamera className="text-lg" /> Attach Photo
                </span>
              </Button>
            </label>
            <Button
              className="bg-maroon hover:bg-maroon/90 text-white rounded-lg transition-all duration-200"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <MdMail className="text-lg" /> Send Message
                </>
              )}
            </Button>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            id="photoUpload"
            onChange={handleFileChange}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageChat;

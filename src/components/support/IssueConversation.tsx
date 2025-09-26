import { Textarea } from "../ui/textarea";
import { Paperclip, CircleArrowUp } from "lucide-react";

export default function IssueConversation() {
  return (
    <div
      className="w-5/9 flex-1 bg-primary/5"
      style={{
        position: "relative",
      }}
    >
      <div
        className="bg-white [box-shadow:rgba(0,_0,_0,_0.1)_0px_-1px_5px_2px] rounded-t-md w-3/4 m-auto "
        style={{
          position: "absolute",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Textarea
          className="p-5 h-[120px] outline-none border-0 rounded-none border-b-1 border-gray-200"
          placeholder="Send Message..."
          style={{ resize: "none" }}
        />
        <div className="px-3 py-2 flex justify-between">
          <div>
            <Paperclip />
          </div>
          <div>
            <CircleArrowUp fill="var(--primary)" stroke="white" size={32} />
          </div>
        </div>
      </div>
    </div>
  );
}

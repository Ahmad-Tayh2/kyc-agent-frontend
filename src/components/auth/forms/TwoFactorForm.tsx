import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp"

const otpSchema = z.object({
  code: z.string().length(6, "Enter the 6-digit code"),
});

type OtpInputs = z.infer<typeof otpSchema>;

const OTP_LENGTH = 6;
const RESEND_TIME = 300; // 5 minutes in seconds

const TwoFactorForm: React.FC<{ onVerify: (code: string) => void; phoneOrEmail?: string; }> = ({ onVerify, phoneOrEmail }) => {
  const [timer, setTimer] = useState(RESEND_TIME);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<OtpInputs>({
    // resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
  });

  React.useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const code = watch("code");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;
    let newCode = code.split("");
    newCode[idx] = val[val.length - 1];
    const joined = newCode.join("").padEnd(OTP_LENGTH, "");
    setValue("code", joined, { shouldValidate: true });
    if (idx < OTP_LENGTH - 1 && inputRefs.current[idx + 1]) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const onResend = () => {
    setResending(true);
    setTimeout(() => {
      setTimer(RESEND_TIME);
      setResending(false);
      // Trigger resend OTP logic here
    }, 1000);
  };

  const onSubmit = (data: OtpInputs) => {
    onVerify(data.code);
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md w-full mx-auto">
      <div>
        <h1 className="text-[30px] w-1/2 font-bold mb-2">Two-factor Authentication</h1>
        <p className="text-muted-foreground mb-6 w-4/5">
          Enter the code sent to your mobile number {phoneOrEmail || "******7339, or email."}
        </p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Enter Code</label>
        {/* <div className="flex gap-2 justify-start">
          {Array.from({ length: OTP_LENGTH }).map((_, idx) => (
            <Input
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-12 h-12 text-center text-xl border rounded"
              value={code[idx] || ""}
              onChange={e => handleChange(e, idx)}
              onKeyDown={e => handleKeyDown(e, idx)}
            //   ref={el => (inputRefs.current[idx] = el)}
              autoFocus={idx === 0}
            />
          ))}
        </div>
        <br/> */}
        <InputOTP autoFocus maxLength={6} onChange={(val)=>console.log(val)} onComplete={(val)=>console.log("enddd  =  =", val)}>
      <InputOTPGroup className="flex gap-3 justify-start">
        <InputOTPSlot index={0}  className="w-11 h-11 text-center text-xl border rounded" />
        <InputOTPSlot index={1} className="w-11 h-11 text-center text-xl border rounded"/>
        <InputOTPSlot index={2} className="w-11 h-11 text-center text-xl border rounded"/>
        <InputOTPSlot index={3} className="w-11 h-11 text-center text-xl border rounded"/>
        <InputOTPSlot index={4} className="w-11 h-11 text-center text-xl border rounded"/>
        <InputOTPSlot index={5} className="w-11 h-11 text-center text-xl border rounded"/>
      </InputOTPGroup>
     
    </InputOTP>
        {errors.code && <span className="text-destructive text-xs">{errors.code.message}</span>}
      </div>
      <div className="flex items-center justify-between mb-4 w-[72%]">
        <span className="text-sm">{minutes}:{seconds.toString().padStart(2, "0")}</span>
        <Button type="button" variant="link" className="p-0 h-auto text-primary" disabled={timer > 0 || resending} onClick={onResend}>
          Resend OTP
        </Button>
      </div>
      <Button type="submit" disabled className="w-fit px-8 py-5 border-b-2 border-t-2 border-t-[#31dada] border-b-[#149393]">VERIFY</Button>
    </form>
  );
};

export default TwoFactorForm; 
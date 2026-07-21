"use client";

import { useActionState, useEffect, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/ui/field-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { leadFormSchema, type LeadFormValues } from "@/lib/validations/lead";
import { organisationTypes, serviceInterestOptions } from "@/lib/constants";
import { submitLead } from "@/app/(marketing)/contact/actions";
import { initialLeadActionState } from "@/lib/lead-action-state";

export function LeadForm({ defaultService }: { defaultService?: string }) {
  const [state, formAction, isPending] = useActionState(submitLead, initialLeadActionState);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      organisationType: "",
      serviceInterest: defaultService ?? "",
      message: "",
    },
  });

  const organisationType = watch("organisationType");
  const serviceInterest = watch("serviceInterest");

  useEffect(() => {
    if (state.status === "success") {
      toast.success("Message sent!", { description: state.message });
      reset({
        name: "",
        phone: "",
        email: "",
        organisationType: "",
        serviceInterest: "",
        message: "",
      });
    } else if (state.status === "error") {
      toast.error("Something went wrong", { description: state.message });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const onValid = (values: LeadFormValues) => {
    startTransition(() => {
      formAction(values);
    });
  };

  return (
    <form onSubmit={handleSubmit(onValid)} className="grid gap-5" noValidate>
      <div>
        <Label htmlFor="l-name">Full name</Label>
        <Input id="l-name" placeholder="Kwame Mensah" {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="l-phone">Phone number</Label>
          <Input id="l-phone" placeholder="024 123 4567" {...register("phone")} />
          <FieldError message={errors.phone?.message} />
        </div>
        <div>
          <Label htmlFor="l-email">Email (optional)</Label>
          <Input id="l-email" type="email" placeholder="you@business.com" {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="l-org-type">Organisation type</Label>
          <Select
            value={organisationType}
            onValueChange={(v) => setValue("organisationType", v, { shouldValidate: true })}
          >
            <SelectTrigger id="l-org-type">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {organisationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" {...register("organisationType")} />
          <FieldError message={errors.organisationType?.message} />
        </div>

        <div>
          <Label htmlFor="l-service">What do you need help with?</Label>
          <Select
            value={serviceInterest}
            onValueChange={(v) => setValue("serviceInterest", v, { shouldValidate: true })}
          >
            <SelectTrigger id="l-service">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {serviceInterestOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" {...register("serviceInterest")} />
          <FieldError message={errors.serviceInterest?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="l-message">Anything else we should know? (optional)</Label>
        <Textarea
          id="l-message"
          placeholder="E.g. I have 2 shops and want both connected."
          rows={4}
          {...register("message")}
        />
        <FieldError message={errors.message?.message} />
      </div>

      <Button type="submit" size="lg" className="mt-1 w-full sm:w-auto" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Request my free assessment
      </Button>
    </form>
  );
}

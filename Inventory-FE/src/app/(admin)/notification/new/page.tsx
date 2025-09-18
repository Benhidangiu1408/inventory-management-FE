"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Form from "@/components/form/Form";
import PhoneInput from "@/components/form/group-input/PhoneInput";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import {
  faComment,
  faEnvelope,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function NewNotification() {
  const [sendViaEmail, setSendViaEmail] = useState(false);
  const [sendViaSMS, setSendViaSMS] = useState(false);
  const [sendViaPushNotification, setSendViaPushNotification] = useState(false);

  const countries = [
    { code: "US", label: "+1" },
    { code: "GB", label: "+44" },
    { code: "CA", label: "+1" },
    { code: "AU", label: "+61" },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Notification Configuration" />
      <Form onSubmit={() => {}}>
        <ComponentCard title="Notification Configuration">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input type="text" id="title" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Input type="text" id="message" />
          </div>
          <div>
            <Label>Icon</Label>
            <Select options={[]} onChange={() => {}} />
          </div>
          <div>
            <Label>Actions</Label>
            <Select options={[]} onChange={() => {}} />
          </div>
          <div>
            <Label>Frequency</Label>
            <Select options={[]} onChange={() => {}} />
          </div>
          <ComponentCard title="Notification Alert Ways">
            <div className="flex gap-4">
              <Checkbox
                checked={sendViaEmail}
                onChange={setSendViaEmail}
                label="Send via Email"
                startIcon={<FontAwesomeIcon icon={faEnvelope} />}
              />
              <Checkbox
                checked={sendViaSMS}
                onChange={setSendViaSMS}
                label="Send via SMS"
                startIcon={<FontAwesomeIcon icon={faComment} />}
              />
              <Checkbox
                checked={sendViaPushNotification}
                onChange={setSendViaPushNotification}
                label="Send via Push Notification"
              />
            </div>
          </ComponentCard>
          {sendViaEmail && (
            <div className="relative">
              <Input type="email" placeholder="Email" className="pl-[62px]" />
              <span className="absolute top-1/2 left-0 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
            </div>
          )}
          {sendViaSMS && (
            <div>
              <Label>Phone</Label>
              <PhoneInput
                selectPosition="start"
                countries={countries}
                placeholder="+1 (555) 000-0000"
                onChange={() => {}}
              />
            </div>
          )}
          <Button startIcon={<FontAwesomeIcon icon={faPlus} />}>Create</Button>
        </ComponentCard>
      </Form>
    </div>
  );
}

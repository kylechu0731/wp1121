"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import NewEventDialog from "./NewEventDialog";

export default function NewEventButton() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        //variant="outline"
        onClick={() => setDialogOpen(true)}
      >New Event</Button>
      <NewEventDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
    </>
  );
}
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type NewEventAlertDialogProps = {
  dialogOpen: boolean,
  setDialogOpen: (e: boolean) => void,
  close: () => void,
};

export function NewEventAlertDialog({
  dialogOpen,
  setDialogOpen,
  close,
}: NewEventAlertDialogProps) {

  const handleOpenChange = (open: boolean) => {
    if(open)
      setDialogOpen(true);
    else {
      setDialogOpen(false);
    }
  }

  return (
    <AlertDialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="bg-white bg-opacity-60">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You may lost your unsaved event information.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Continue</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 hover:bg-red-300" onClick={() => close()}>Cancel</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
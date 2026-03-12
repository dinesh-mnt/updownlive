import { toast } from "@/hooks/use-toast"

export const showSuccessToast = (title: string, description?: string) => {
  toast({
    title,
    description,
    variant: "success",
  })
}

export const showErrorToast = (title: string, description?: string) => {
  toast({
    title,
    description,
    variant: "destructive",
  })
}

export const showWarningToast = (title: string, description?: string) => {
  toast({
    title,
    description,
    variant: "warning",
  })
}

export const showInfoToast = (title: string, description?: string) => {
  toast({
    title,
    description,
  })
}

// Common toast messages for vendor dashboard
export const vendorToasts = {
  productSaved: () => showSuccessToast("Product Saved", "Your product has been saved successfully."),
  productDeleted: () => showSuccessToast("Product Deleted", "Product has been removed from your catalog."),
  orderUpdated: () => showSuccessToast("Order Updated", "Order status has been updated successfully."),
  settingsSaved: () => showSuccessToast("Settings Saved", "Your settings have been updated."),
  
  saveError: () => showErrorToast("Save Failed", "Unable to save changes. Please try again."),
  deleteError: () => showErrorToast("Delete Failed", "Unable to delete item. Please try again."),
  networkError: () => showErrorToast("Network Error", "Please check your connection and try again."),
  
  unsavedChanges: () => showWarningToast("Unsaved Changes", "You have unsaved changes that will be lost."),
  lowStock: (productName: string) => showWarningToast("Low Stock Alert", `${productName} is running low on stock.`),
}
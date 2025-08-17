"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useCategories } from "@/hooks/use-categories"
import { Edit, Plus, Trash } from "lucide-react"

export function Categories() {
  const { toast } = useToast()
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories()

  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("green")
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; color: string } | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      })
      return
    }

    addCategory({
      name: newCategoryName,
      color: newCategoryColor,
    })

    toast({
      title: "Success",
      description: "Category added successfully",
    })

    setNewCategoryName("")
    setNewCategoryColor("green")
    setIsAddDialogOpen(false)
  }

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      })
      return
    }

    updateCategory(editingCategory.id, {
      name: editingCategory.name,
      color: editingCategory.color,
    })

    toast({
      title: "Success",
      description: "Category updated successfully",
    })

    setEditingCategory(null)
    setIsEditDialogOpen(false)
  }

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id)

    toast({
      title: "Success",
      description: "Category deleted successfully",
    })

    setCategoryToDelete(null)
  }

  const colorOptions = [
    { name: "Red", value: "red" },
    { name: "Green", value: "green" },
    { name: "Blue", value: "blue" },
    { name: "Yellow", value: "yellow" },
    { name: "Purple", value: "purple" },
    { name: "Pink", value: "pink" },
    { name: "Orange", value: "orange" },
    { name: "Gray", value: "gray" },
  ]

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
                <DialogDescription>Create a new category to organize your expenses</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Groceries"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <div
                        key={color.value}
                        className={`flex items-center justify-center h-10 rounded-md cursor-pointer border-2 ${
                          newCategoryColor === color.value
                            ? `border-${color.value}-500 bg-${color.value}-100`
                            : "border-transparent hover:border-gray-300"
                        }`}
                        onClick={() => setNewCategoryColor(color.value)}
                      >
                        <div className={`w-6 h-6 rounded-full bg-${color.value}-500`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory}>Add Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Categories</CardTitle>
            <CardDescription>Create, edit, and delete expense categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories?.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground mb-4">No categories found</p>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add your first category
                  </Button>
                </div>
              ) : (
                categories?.map((category) => (
                  <Card key={category.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <div className={`w-4 h-4 rounded-full bg-${category.color}-500 mr-2`}></div>
                        {category.name}
                      </CardTitle>
                    </CardHeader>
                    <CardFooter className="pt-2">
                      <div className="flex space-x-2 ml-auto">
                        <Dialog
                          open={isEditDialogOpen && editingCategory?.id === category.id}
                          onOpenChange={(open) => {
                            setIsEditDialogOpen(open)
                            if (!open) setEditingCategory(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => setEditingCategory(category)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Category</DialogTitle>
                              <DialogDescription>Update the category details</DialogDescription>
                            </DialogHeader>
                            {editingCategory && (
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">Category Name</Label>
                                  <Input
                                    id="edit-name"
                                    value={editingCategory.name}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Color</Label>
                                  <div className="grid grid-cols-4 gap-2">
                                    {colorOptions.map((color) => (
                                      <div
                                        key={color.value}
                                        className={`flex items-center justify-center h-10 rounded-md cursor-pointer border-2 ${
                                          editingCategory.color === color.value
                                            ? `border-${color.value}-500 bg-${color.value}-100`
                                            : "border-transparent hover:border-gray-300"
                                        }`}
                                        onClick={() => setEditingCategory({ ...editingCategory, color: color.value })}
                                      >
                                        <div className={`w-6 h-6 rounded-full bg-${color.value}-500`}></div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setEditingCategory(null)
                                  setIsEditDialogOpen(false)
                                }}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleUpdateCategory}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog
                          open={categoryToDelete === category.id}
                          onOpenChange={(open) => !open && setCategoryToDelete(null)}
                        >
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => setCategoryToDelete(category.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this category. Any expenses with this category will be
                                uncategorized.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

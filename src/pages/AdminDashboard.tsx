import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, LogOut, MessageSquare, Megaphone, Upload, X, ImageIcon, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Demo component - Replace with your actual Supabase integration
const AdminDashboard = () => {
  const [products, setProducts] = useState<any[]>([
    {
      id: '1',
      name: 'Golden Necklace',
      description: 'Elegant 22K gold necklace',
      price: 45000,
      category: 'necklace',
      stock: 5,
      size: 'Adjustable',
      image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'
    },
    {
      id: '2',
      name: 'Diamond Earrings',
      description: 'Sparkling diamond studs',
      price: 85000,
      category: 'earrings',
      stock: 8,
      size: 'Free Size',
      image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500'
    }
  ]);
  const [banners, setBanners] = useState<any[]>([
    { id: '1', title: 'Diwali Sale', subtitle: 'Up to 50% Off', display_order: 0 },
    { id: '2', title: 'New Arrivals', subtitle: 'Latest Collection', display_order: 1 }
  ]);
  const [suggestions, setSuggestions] = useState<any[]>([
    {
      id: '1',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      message: 'Love your collection! Please add more bangles.',
      created_at: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'necklace',
    stock: '10',
    size: '',
    image_url: '',
  });
  const [bannerFormData, setBannerFormData] = useState({
    title: '',
    subtitle: '',
    display_order: '0',
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    alert(message);
  };

  const handleLogout = () => {
    showToast('Logged out successfully');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      showToast('Please upload a valid image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be less than 5MB', 'error');
      return;
    }

    setUploadingImage(true);
    // Simulate upload
    setTimeout(() => {
      const mockUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image_url: mockUrl });
      setUploadingImage(false);
      showToast('Image uploaded successfully!');
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const productData = {
        id: editingProduct?.id || Date.now().toString(),
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        size: formData.size || null,
        image_url: formData.image_url,
      };

      if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? productData : p));
        showToast('Product updated successfully!');
      } else {
        setProducts([productData, ...products]);
        showToast('Product added successfully!');
      }

      setDialogOpen(false);
      resetForm();
      setLoading(false);
    }, 500);
  };

  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const bannerData = {
        id: editingBanner?.id || Date.now().toString(),
        title: bannerFormData.title,
        subtitle: bannerFormData.subtitle || null,
        display_order: parseInt(bannerFormData.display_order),
      };

      if (editingBanner) {
        setBanners(banners.map(b => b.id === editingBanner.id ? bannerData : b));
        showToast('Banner updated successfully!');
      } else {
        setBanners([...banners, bannerData].sort((a, b) => a.display_order - b.display_order));
        showToast('Banner added successfully!');
      }

      setBannerDialogOpen(false);
      resetBannerForm();
      setLoading(false);
    }, 500);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      size: product.size || '',
      image_url: product.image_url || '',
    });
    setDialogOpen(true);
  };

  const handleEditBanner = (banner: any) => {
    setEditingBanner(banner);
    setBannerFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      display_order: banner.display_order.toString(),
    });
    setBannerDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setProducts(products.filter(p => p.id !== id));
    showToast('Product deleted successfully!');
  };

  const handleDeleteBanner = (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    setBanners(banners.filter(b => b.id !== id));
    showToast('Banner deleted successfully!');
  };

  const handleDeleteSuggestion = (id: string) => {
    if (!confirm('Are you sure you want to delete this suggestion?')) return;
    setSuggestions(suggestions.filter(s => s.id !== id));
    showToast('Suggestion deleted successfully!');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'necklace',
      stock: '10',
      size: '',
      image_url: '',
    });
    setEditingProduct(null);
  };

  const resetBannerForm = () => {
    setBannerFormData({
      title: '',
      subtitle: '',
      display_order: '0',
    });
    setEditingBanner(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50">
      {/* Elegant Header with Gold Accent */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-amber-200/50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full"></div>
                <div className="relative h-12 w-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  J
                </div>
              </div>
              <div className="border-l border-amber-300 pl-4">
                <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 bg-clip-text text-transparent">
                  Admin Atelier
                </h1>
                <p className="text-xs tracking-wide text-slate-600 font-light">JEWELRY MANAGEMENT</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all min-h-[44px]"
            >
              <LogOut className="h-4 w-4 text-amber-700" />
              <span className="hidden sm:inline text-slate-700">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Tabs defaultValue="products" className="w-full space-y-8">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1.5 bg-white/60 backdrop-blur-sm border border-amber-200/50 shadow-sm">
            <TabsTrigger
              value="products"
              className="text-sm sm:text-base py-3 min-h-[44px] data-[state=active]:bg-gradient-to-br data-[state=active]:from-amber-100 data-[state=active]:to-amber-50 data-[state=active]:text-amber-900 data-[state=active]:shadow-sm font-medium"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Products</span>
              <span className="sm:hidden">Items</span>
            </TabsTrigger>
            <TabsTrigger
              value="banners"
              className="text-sm sm:text-base py-3 min-h-[44px] data-[state=active]:bg-gradient-to-br data-[state=active]:from-amber-100 data-[state=active]:to-amber-50 data-[state=active]:text-amber-900 data-[state=active]:shadow-sm font-medium"
            >
              <Megaphone className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Banners</span>
              <span className="sm:hidden">Ads</span>
            </TabsTrigger>
            <TabsTrigger
              value="suggestions"
              className="text-sm sm:text-base py-3 min-h-[44px] data-[state=active]:bg-gradient-to-br data-[state=active]:from-amber-100 data-[state=active]:to-amber-50 data-[state=active]:text-amber-900 data-[state=active]:shadow-sm font-medium"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Messages</span>
              <span className="sm:hidden">Msgs</span>
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50">
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-800">Collection</h2>
                <p className="text-sm text-slate-600 mt-1 font-light tracking-wide">Curate your exquisite pieces</p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto min-h-[44px] bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg shadow-amber-600/30 hover:shadow-xl hover:shadow-amber-700/40 transition-all font-medium">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-amber-200">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-serif text-slate-800">
                      {editingProduct ? 'Edit Product' : 'New Product'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base font-medium text-slate-700">Product Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-base font-medium text-slate-700">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="resize-none border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                        placeholder="Describe your product..."
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-base font-medium text-slate-700">Price (₹)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          required
                          className="h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                          placeholder="0.00"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stock" className="text-base font-medium text-slate-700">Stock</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          required
                          className="h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                          placeholder="10"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-base font-medium text-slate-700">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                          <SelectTrigger className="h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="necklace">Necklace</SelectItem>
                            <SelectItem value="earrings">Earrings</SelectItem>
                            <SelectItem value="bangles">Bangles</SelectItem>
                            <SelectItem value="rings">Rings</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="size" className="text-base font-medium text-slate-700">Size</Label>
                        <Input
                          id="size"
                          value={formData.size}
                          onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                          placeholder="Free Size, S, M, L"
                          className="h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-medium text-slate-700">Product Image</Label>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <label className="flex-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full h-12 border-amber-200 hover:bg-amber-50 hover:border-amber-400"
                              onClick={() => document.getElementById('image-upload')?.click()}
                              disabled={uploadingImage}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              {uploadingImage ? 'Uploading...' : 'Upload Image'}
                            </Button>
                          </label>
                          <span className="text-sm text-slate-500 self-center font-light">or</span>
                          <Input
                            type="url"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            placeholder="Paste image URL"
                            className="flex-1 h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                          />
                        </div>
                        {formData.image_url && (
                          <div className="relative rounded-xl overflow-hidden border border-amber-200">
                            <img
                              src={formData.image_url}
                              alt="Preview"
                              className="w-full h-64 object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-3 right-3 shadow-lg"
                              onClick={() => setFormData({ ...formData, image_url: '' })}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 text-base bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg shadow-amber-600/30 font-medium"
                      disabled={loading || uploadingImage}
                    >
                      {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border border-amber-200/50 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden aspect-square">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-5">
                    <CardTitle className="text-lg font-serif text-slate-800 line-clamp-1 mb-2">{product.name}</CardTitle>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 font-light">
                      <span className="capitalize px-2 py-1 bg-amber-50 rounded-full text-amber-700">{product.category}</span>
                      {product.size && <span>• {product.size}</span>}
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4 font-light">Stock: {product.stock} units</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 min-h-[44px] border-amber-300 hover:bg-amber-50 hover:border-amber-400 text-amber-700 hover:text-amber-800"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 min-h-[44px] border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-20 px-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-amber-200/50">
                <Sparkles className="h-20 w-20 mx-auto text-amber-400 mb-4" />
                <p className="text-2xl font-serif text-slate-700 mb-2">Your collection awaits</p>
                <p className="text-sm text-slate-500 font-light">Add your first exquisite piece</p>
              </div>
            )}
          </TabsContent>

          {/* Banners Tab */}
          <TabsContent value="banners" className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50">
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-800">Promotions</h2>
                <p className="text-sm text-slate-600 mt-1 font-light tracking-wide">Showcase your featured collections</p>
              </div>
              <Dialog open={bannerDialogOpen} onOpenChange={(open) => {
                setBannerDialogOpen(open);
                if (!open) resetBannerForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto min-h-[44px] bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg shadow-amber-600/30 hover:shadow-xl hover:shadow-amber-700/40 transition-all font-medium">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Banner
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-white/95 backdrop-blur-xl border-amber-200">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-serif text-slate-800">
                      {editingBanner ? 'Edit Banner' : 'New Banner'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleBannerSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-base font-medium text-slate-700">Title</Label>
                      <Input
                        id="title"
                        value={bannerFormData.title}
                        onChange={(e) => setBannerFormData({ ...bannerFormData, title: e.target.value })}
                        required
                        className="h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                        placeholder="Sale of the Day"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subtitle" className="text-base font-medium text-slate-700">Subtitle</Label>
                      <Input
                        id="subtitle"
                        value={bannerFormData.subtitle}
                        onChange={(e) => setBannerFormData({ ...bannerFormData, subtitle: e.target.value })}
                        className="h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                        placeholder="Up to 50% Off"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="display_order" className="text-base font-medium text-slate-700">Display Order</Label>
                      <Input
                        id="display_order"
                        type="number"
                        value={bannerFormData.display_order}
                        onChange={(e) => setBannerFormData({ ...bannerFormData, display_order: e.target.value })}
                        required
                        className="h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                        placeholder="0"
                      />
                      <p className="text-xs text-slate-500 font-light">Lower numbers appear first</p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 text-base bg-gradient-to-r from-amber-600 to-amber
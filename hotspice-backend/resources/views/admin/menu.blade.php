<!DOCTYPE html>
<html>
<head>
    <title>Hot & Spice — Admin</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        h1 { color: #E4002B; }
        h2 { color: #333; margin-top: 40px; }
        nav { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        nav a { color: #E4002B; font-weight: bold; text-decoration: none; margin-right: 20px; }
        nav a.active { text-decoration: underline; }
        .admin-info { font-size: 13px; color: #555; }
        .admin-info button { padding: 4px 10px; font-size: 12px; margin-left: 10px; }
        table { width: 100%; background: #fff; border-collapse: collapse; box-shadow: 0 1px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
        th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; vertical-align: middle; }
        th { background: #E4002B; color: #fff; }
        input[type=text], input[type=number], select, textarea { padding: 6px 8px; border: 1px solid #ccc; border-radius: 6px; width: 100%; box-sizing: border-box; }
        input[type=number] { width: 80px; }
        button, .btn { background: #E4002B; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; }
        button.secondary { background: #777; }
        button.danger { background: #b3001b; }
        .row-actions { display: flex; gap: 6px; }
        .add-card { background: #fff; padding: 16px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); margin-bottom: 30px; }
        .add-card h3 { margin-top: 0; }
        .add-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; align-items: end; }
        .add-grid label { font-size: 12px; color: #555; display: block; margin-bottom: 4px; }
        .unavailable { opacity: 0.5; }
        .flash-error { background: #ffe3e3; color: #b3001b; padding: 10px 16px; border-radius: 8px; margin-bottom: 16px; font-weight: bold; }
        .field-errors { background: #ffe3e3; color: #b3001b; padding: 10px 16px; border-radius: 8px; margin-bottom: 16px; }
        .field-errors ul { margin: 0; padding-left: 20px; }
    </style>
</head>
<body>
    <h1>🍔 Hot & Spice — Admin</h1>
    <nav>
        <div>
            <a href="/admin/dashboard">Dashboard</a>
            <a href="/admin/orders">Orders</a>
            <a href="/admin/menu" class="active">Menu</a>
            <a href="/admin/customers">Customers</a>
            <a href="/admin/coupons">Coupons</a>
            <a href="/admin/riders">Riders</a>
            <a href="/admin/settings">Settings</a>
        </div>
        <div class="admin-info">
            {{ Auth::guard('admin')->user()->name }}
            <form action="/admin/logout" method="POST" style="display:inline;">
                @csrf
                <button type="submit">Logout</button>
            </form>
        </div>
    </nav>

    @if (session('error'))
        <div class="flash-error">{{ session('error') }}</div>
    @endif

    @if ($errors->any())
        <div class="field-errors">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <h2>Categories</h2>
    <div class="add-card">
        <h3>Add Category</h3>
        <form action="/admin/menu/categories" method="POST" class="add-grid">
            @csrf
            <div>
                <label>Name</label>
                <input type="text" name="name" value="{{ old('name') }}" required>
            </div>
            <div>
                <label>Slug (optional)</label>
                <input type="text" name="slug" value="{{ old('slug') }}" placeholder="auto-generated from name">
            </div>
            <div>
                <label>Sort order</label>
                <input type="number" name="sort_order" value="{{ old('sort_order', ($categories->max('sort_order') ?? -1) + 1) }}">
            </div>
            <div>
                <label>Description</label>
                <input type="text" name="description" value="{{ old('description') }}">
            </div>
            <div>
                <button type="submit">Add Category</button>
            </div>
        </form>
    </div>

    {{-- Update/delete forms live outside the table; row inputs bind to them via the form="" attribute. --}}
    @foreach ($categories as $category)
        <form id="cat-form-{{ $category->id }}" action="/admin/menu/categories/{{ $category->id }}" method="POST" style="display:none;">
            @csrf
        </form>
        <form id="cat-delete-{{ $category->id }}" action="/admin/menu/categories/{{ $category->id }}/delete" method="POST" style="display:none;" onsubmit="return confirm('Delete this category? This only succeeds if it has no menu items left.');">
            @csrf
        </form>
    @endforeach

    <table>
        <tr>
            <th>Name</th>
            <th style="width:160px">Slug</th>
            <th style="width:100px">Sort</th>
            <th style="width:80px">Active</th>
            <th style="width:160px">Actions</th>
        </tr>
        @foreach ($categories as $category)
        <tr class="{{ $category->is_active ? '' : 'unavailable' }}">
            <td><input type="text" name="name" value="{{ $category->name }}" form="cat-form-{{ $category->id }}" required></td>
            <td><input type="text" name="slug" value="{{ $category->slug }}" form="cat-form-{{ $category->id }}"></td>
            <td><input type="number" name="sort_order" value="{{ $category->sort_order }}" form="cat-form-{{ $category->id }}"></td>
            <td><input type="checkbox" name="is_active" form="cat-form-{{ $category->id }}" {{ $category->is_active ? 'checked' : '' }}></td>
            <td class="row-actions">
                <button type="submit" form="cat-form-{{ $category->id }}">Save</button>
                <button type="submit" form="cat-delete-{{ $category->id }}" class="danger">Delete</button>
            </td>
        </tr>
        @endforeach
    </table>

    <h2>Menu Items</h2>
    <div class="add-card">
        <h3>Add Menu Item</h3>
        <form action="/admin/menu/items" method="POST" class="add-grid">
            @csrf
            <div>
                <label>Category</label>
                <select name="category_id" required>
                    @foreach ($categories as $category)
                        <option value="{{ $category->id }}" {{ old('category_id') == $category->id ? 'selected' : '' }}>{{ $category->name }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label>Name</label>
                <input type="text" name="name" value="{{ old('name') }}" required>
            </div>
            <div>
                <label>Price (Rs.)</label>
                <input type="number" step="0.01" name="price" value="{{ old('price') }}" required>
            </div>
            <div>
                <label>Calories</label>
                <input type="number" name="calories" value="{{ old('calories') }}">
            </div>
            <div>
                <label>Image URL</label>
                <input type="text" name="image" value="{{ old('image') }}" placeholder="https://...">
            </div>
            <div style="grid-column: 1 / -1;">
                <label>Description</label>
                <input type="text" name="description" value="{{ old('description') }}">
            </div>
            <div>
                <button type="submit">Add Item</button>
            </div>
        </form>
    </div>

    @foreach ($menuItems as $item)
        <form id="item-form-{{ $item->id }}" action="/admin/menu/items/{{ $item->id }}" method="POST" style="display:none;">
            @csrf
        </form>
        <form id="item-delete-{{ $item->id }}" action="/admin/menu/items/{{ $item->id }}/delete" method="POST" style="display:none;" onsubmit="return confirm('Delete this menu item?');">
            @csrf
        </form>
    @endforeach

    <table>
        <tr>
            <th>Image</th>
            <th>Name / Description</th>
            <th style="width:140px">Category</th>
            <th style="width:100px">Price</th>
            <th style="width:90px">Calories</th>
            <th style="width:70px">Avail.</th>
            <th style="width:70px">Feat.</th>
            <th style="width:150px">Actions</th>
        </tr>
        @foreach ($menuItems as $item)
        @php $fid = 'item-form-' . $item->id; @endphp
        <tr class="{{ $item->is_available ? '' : 'unavailable' }}">
            <td>
                @if ($item->image)
                    <img src="{{ $item->image }}" alt="" style="width:50px;height:50px;object-fit:cover;border-radius:6px;">
                @endif
            </td>
            <td>
                <input type="text" name="name" value="{{ $item->name }}" form="{{ $fid }}" required style="margin-bottom:4px;">
                <input type="text" name="description" value="{{ $item->description }}" placeholder="Description" form="{{ $fid }}">
                <input type="text" name="image" value="{{ $item->image }}" placeholder="Image URL" form="{{ $fid }}" style="margin-top:4px;">
            </td>
            <td>
                <select name="category_id" form="{{ $fid }}">
                    @foreach ($categories as $category)
                        <option value="{{ $category->id }}" {{ $item->category_id === $category->id ? 'selected' : '' }}>
                            {{ $category->name }}
                        </option>
                    @endforeach
                </select>
            </td>
            <td><input type="number" step="0.01" name="price" value="{{ $item->price }}" form="{{ $fid }}"></td>
            <td><input type="number" name="calories" value="{{ $item->calories }}" form="{{ $fid }}"></td>
            <td><input type="checkbox" name="is_available" form="{{ $fid }}" {{ $item->is_available ? 'checked' : '' }}></td>
            <td><input type="checkbox" name="is_featured" form="{{ $fid }}" {{ $item->is_featured ? 'checked' : '' }}></td>
            <td class="row-actions">
                <button type="submit" form="{{ $fid }}">Save</button>
                <button type="submit" form="item-delete-{{ $item->id }}" class="danger">Delete</button>
            </td>
        </tr>
        @endforeach
    </table>
</body>
</html>

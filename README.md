# Pure
> Pure javascript/css library for HTML development

 - Download [Pure.js]() and [Pure.css]()

### Header

### Refresher
Execute any function on pan window to bottom while scroll is in top.

```HTML
  <pure-refresher></pure-refresher>
```

### Slider
You can implements your CSS/HTML styles into any tag.

```HTML
  <!-- 
    active: number - Select slide index (default 0)
    width: number - Width content (default 100%)
    height: number - Height content (default 100vh)
    timer: number - Time of transition animation (default 300ms)

    optional TABS (tab index == slide index)
      tray-height: number - Height of tray (default 3)
      tray-color: string - Color of tray (default white)
      no-fixed: none - Tabs not fixed on width

    required SLIDES
  -->
  <pure-slider>

    <tabs>
      <tab></tab>
      <tab></tab>
      <tab></tab>
      <tab></tab>
    </tabs>

    <slides>
      <slide></slide>
      <slide></slide>
      <slide></slide>
      <slide></slide>
    </slides>

  </pure-slider>
```

### Navigator
Pages navigation

### Show/Hide elements
Content show/hide

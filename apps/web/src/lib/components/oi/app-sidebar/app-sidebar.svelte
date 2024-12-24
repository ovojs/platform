<script lang="ts" module>
  import AppSidebarFooter from "./app-sidebar-footer.svelte";
  import AppSidebarHeader from "./app-sidebar-header.svelte";
  import AppSidebarNav from "./app-sidebar-nav.svelte";
</script>

<script lang="ts">
</script>

<div class="h-screen p-3 pt-10 flex flex-col items-center" data-tauri-drag-region>
  <AppSidebarHeader />
  <AppSidebarNav />
  <AppSidebarFooter />
</div>

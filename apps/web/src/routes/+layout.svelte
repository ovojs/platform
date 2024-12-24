<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
  import { AppSidebar } from "$lib/components/oi/app-sidebar";
  import "../app.css";
  let { children } = $props();
</script>

<div class="flex">
	<ModeWatcher />
	<AppSidebar />
	<div class="flex-1">
		{@render children()}
	</div>
</div>

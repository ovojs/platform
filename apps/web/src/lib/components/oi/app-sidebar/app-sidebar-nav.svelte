<script lang="ts" module>
  import { Button } from "$lib/components/ui/button";
  import { Box, Folder, Gamepad2, Hash } from "lucide-svelte";
</script>
<nav class="flex-1 py-4" data-tauri-drag-region>
  <ul class="flex flex-col gap-1">
    <li>
      <Button class="opacity-65 [&_svg]:size-6" variant="ghost" size="icon">
        <Box />
      </Button>
    </li>
    <li>
      <Button class="opacity-65 [&_svg]:size-6" variant="ghost" size="icon">
        <Gamepad2 />
      </Button>
    </li>
    <li>
      <Button class="opacity-65 [&_svg]:size-6" variant="ghost" size="icon">
        <Folder />
      </Button>
    </li>
    <li>
      <Button class="opacity-65 [&_svg]:size-6" variant="ghost" size="icon">
        <Hash />
      </Button>
    </li>
  </ul>
</nav>
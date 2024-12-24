<script lang="ts" module>
  import { Button } from "$lib/components/ui/button";
  import { Bolt } from "lucide-svelte";
</script>

<footer>
  <ul>
    <li>
      <Button class="opacity-65 [&_svg]:size-6" variant="ghost" size="icon">
        <Bolt />
      </Button>
    </li>
  </ul>
</footer>
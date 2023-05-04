// Import `markdown-it` at the top of your script
import MarkdownIt from 'markdown-it';

// ...

export default {
  // ...
  setup() {
    // ...

    // Create a local markdown instance
    const markdown = new MarkdownIt({
    });

    // Create a method to render markdown
    const renderMarkdown = (source) => markdown.render(source);

    // Expose the `renderMarkdown` method to the template
    return {
      renderMarkdown,
      // ...
    };
  },
};

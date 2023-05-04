<template>
  <div>
    <form @submit.prevent>
      <input type="file" @change="handleFileUpload" accept="image/*">
    </form>
    <img v-if="previewSrc" :src="previewSrc" alt="Uploaded image preview">
  </div>
</template>

<script>
export default {
  data() {
    return {
      previewSrc: "",
    };
  },
  methods: {
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Display the uploaded image immediately
      this.previewSrc = URL.createObjectURL(file);

      // Send the file to the server to save it in the database
      const formData = new FormData();
      formData.append("file", file);

      // Add user id to the form data
      const userId = 1;
      formData.append("user_id", userId);

      try {
        const response = await fetch("http://127.0.0.1:8000/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        console.log("File uploaded successfully:", result);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    },
  },
};
</script>

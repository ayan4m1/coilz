export const readFile = async (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const { result } = event.currentTarget;

      if (result) {
        resolve(result);
      } else {
        reject();
      }
    };

    reader.readAsText(file);
  });

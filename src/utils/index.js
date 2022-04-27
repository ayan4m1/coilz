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

export const wires = [
  { gauge: 40, diameter: 0.0799, ampacity: 3.44 },
  { gauge: 38, diameter: 0.101, ampacity: 2.16 },
  { gauge: 36, diameter: 0.127, ampacity: 1.36 },
  { gauge: 34, diameter: 0.16, ampacity: 0.855 },
  { gauge: 32, diameter: 0.202, ampacity: 0.537 },
  { gauge: 30, diameter: 0.255, ampacity: 0.338 },
  { gauge: 28, diameter: 0.321, ampacity: 0.213 },
  { gauge: 26, diameter: 0.405, ampacity: 0.134 },
  { gauge: 24, diameter: 0.511, ampacity: 0.0841 },
  { gauge: 22, diameter: 0.644, ampacity: 0.0529 },
  { gauge: 20, diameter: 0.812, ampacity: 0.0333 },
  { gauge: 18, diameter: 1.02, ampacity: 0.0209 },
  { gauge: 16, diameter: 1.29, ampacity: 0.0132 },
  { gauge: 14, diameter: 1.63, ampacity: 0.00827 },
  { gauge: 12, diameter: 2.05, ampacity: 0.0052 },
  { gauge: 10, diameter: 2.59, ampacity: 0.00327 },
  { gauge: 8, diameter: 3.26, ampacity: 0.002 }
];

export const getWire = (gauge) => wires.find((wire) => wire.gauge === gauge);

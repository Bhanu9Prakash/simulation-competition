# Mass Evolution Simulation

This project simulates the evolution of organisms based on their mass. Each organism is represented by a square with crossed lines, where the size corresponds to its mass. The goal is for the population to evolve towards an optimal mass range. Organisms with a mass in this range have higher fitness and are more likely to reproduce.

## Usage

### Running the Simulation

1. **Starting the Simulation**: Click the `Start` button to begin the simulation. The organisms will start evolving over time.
2. **Pausing the Simulation**: Click the `Pause` button to pause the simulation at any time.
3. **Resetting the Simulation**: Click the `Reset` button to restart the simulation with a new population.
4. **Adjusting Simulation Speed**: Use the `Simulation Speed` slider to control the speed at which the simulation runs (0.5x to 2x).
5. **Setting Initial Population Size**: Enter the desired initial population size in the `Initial Population` input field.
6. **Setting Mutation Rate**: Use the `Mutation Rate` slider to adjust the mutation rate (0% to 100%).

### UI Elements

- **Generation Count**: Displays the current generation number.
- **Timer**: Shows the remaining time for the current simulation run.
- **Average Mass**: Displays the average mass of the current population.

### Fitness Chart

The fitness chart visualizes the average fitness of the population over generations. The higher the fitness, the better the population is adapting to the optimal mass range.

### Theme Toggle

Click the theme toggle button to switch between light and dark mode.

### Explanation Modal

Click the question mark button (?) at the bottom right to open a modal with information about the simulation and its goals. Close the modal by clicking the `Close` button.


## Code Overview

The code consists of two main files:
1. `index.html`: Contains the HTML structure and UI elements.
2. `script.js`: Contains the logic for the simulation, such as managing the population, running the simulation, and updating the UI.

### Key Functions and Classes

- **setup()**: Initializes the canvas, UI elements, and chart.
- **draw()**: Continuously updates the simulation and UI elements.
- **Organism**: A class representing an organism with properties like position, mass, color, and fitness. It includes methods for displaying the organism, calculating fitness, and reproducing.
- **updateSimulation()**: Manages the evolution process by calculating fitness, sorting organisms, and handling reproduction.
- **toggleSimulation()**, **resetSimulation()**: Handle starting, pausing, and resetting the simulation.
- **updateSpeed()**, **updateMutationRate()**: Update simulation speed and mutation rate based on user input.
- **initFitnessChart()**, **updateFitnessChart()**: Initialize and update the fitness chart.


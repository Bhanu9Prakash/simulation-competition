let population = [];
let generation = 0;
let timer = 60;
let isRunning = false;
let simulationSpeed = 1;
let fitnessHistory = [];
let fitnessChart;

// Constants for mass evolution
const OPTIMAL_MASS_MIN = 50;
const OPTIMAL_MASS_MAX = 150;
const MAX_MASS = 300;

function setup() {
    let canvasContainer = select('#canvasContainer');
    let canvas = createCanvas(canvasContainer.width, canvasContainer.height);
    canvas.parent('canvasContainer');

    // Initialize UI elements
    select('#startPauseBtn').mousePressed(toggleSimulation);
    select('#resetBtn').mousePressed(resetSimulation);
    select('#speedSlider').input(updateSpeed);
    select('#mutationRate').input(updateMutationRate);
    select('#showExplanation').mousePressed(() => document.getElementById('explanationModal').classList.remove('hidden'));
    select('#closeModal').mousePressed(() => document.getElementById('explanationModal').classList.add('hidden'));
    select('#themeToggle').mousePressed(toggleTheme);

    resetSimulation();
    initFitnessChart();
}

function draw() {
    background(220);

    if (isRunning) {
        updateSimulation();
        timer -= (deltaTime / 1000) * simulationSpeed;
        if (timer <= 0) {
            isRunning = false;
            select('#startPauseBtn').html('Start');
            alert('Simulation complete!');
        }
    }

    // Draw organisms
    for (let org of population) {
        org.display();
    }

    // Update UI
    select('#generationCount').html(`Generation: ${generation}`);
    select('#timer').html(`Time: ${timer.toFixed(1)}s`);
    updateFitnessChart();
}

class Organism {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.mass = random(10, MAX_MASS);
        this.color = color(random(255), random(255), random(255));
        this.fitness = 0;
    }

    display() {
        push();
        translate(this.position.x, this.position.y);

        // Draw square body
        fill(this.color);
        noStroke();
        let bodySize = sqrt(this.mass) * 1.5;
        rectMode(CENTER);
        rect(0, 0, bodySize, bodySize);

        // Draw crossed lines
        stroke(0);
        line(-bodySize / 2, -bodySize / 2, bodySize / 2, bodySize / 2);
        line(-bodySize / 2, bodySize / 2, bodySize / 2, -bodySize / 2);

        pop();
    }

    calculateFitness() {
        if (this.mass >= OPTIMAL_MASS_MIN && this.mass <= OPTIMAL_MASS_MAX) {
            this.fitness = 1;
        } else {
            let distanceFromOptimal = min(
                abs(this.mass - OPTIMAL_MASS_MIN),
                abs(this.mass - OPTIMAL_MASS_MAX)
            );
            this.fitness = 1 - (distanceFromOptimal / MAX_MASS);
        }
    }

    reproduce() {
        let child = new Organism(
            constrain(this.position.x + random(-20, 20), 0, width),
            constrain(this.position.y + random(-20, 20), 0, height)
        );

        // Inherit mass with mutation
        let mutationRate = getMutationRate();
        child.mass = constrain(this.mass + randomGaussian(0, 10) * mutationRate, 10, MAX_MASS);

        // Inherit color with slight mutation
        child.color = color(
            constrain(red(this.color) + randomGaussian(0, 20) * mutationRate, 0, 255),
            constrain(green(this.color) + randomGaussian(0, 20) * mutationRate, 0, 255),
            constrain(blue(this.color) + randomGaussian(0, 20) * mutationRate, 0, 255)
        );

        return child;
    }
}

function updateSimulation() {
    // Calculate fitness
    for (let org of population) {
        org.calculateFitness();
    }

    // Sort by fitness
    population.sort((a, b) => b.fitness - a.fitness);

    // Keep top 50% and reproduce
    let newPopulation = population.slice(0, population.length / 2);
    while (newPopulation.length < population.length) {
        let parent = random(newPopulation);
        newPopulation.push(parent.reproduce());
    }

    population = newPopulation;
    generation++;

    // Update fitness history
    let avgFitness = population.reduce((sum, org) => sum + org.fitness, 0) / population.length;
    fitnessHistory.push(avgFitness);

    // Update average mass
    let avgMass = population.reduce((sum, org) => sum + org.mass, 0) / population.length;
    select('#dominantTrait').html(`Average Mass: ${avgMass.toFixed(2)}`);
}

function toggleSimulation() {
    isRunning = !isRunning;
    select('#startPauseBtn').html(isRunning ? 'Pause' : 'Start');
}

function resetSimulation() {
    population = [];
    let populationSize = int(select('#populationSize').value());
    for (let i = 0; i < populationSize; i++) {
        population.push(new Organism(random(width), random(height)));
    }
    generation = 0;
    timer = 60;
    isRunning = false;
    fitnessHistory = [];
    if (fitnessChart) {
        fitnessChart.data.labels = [];
        fitnessChart.data.datasets[0].data = [];
        fitnessChart.update();
    }
    select('#startPauseBtn').html('Start');
}

function updateSpeed() {
    simulationSpeed = select('#speedSlider').value();
    select('#speedValue').html(`${simulationSpeed}x`);
}

function updateMutationRate() {
    let rate = select('#mutationRate').value();
    select('#mutationValue').html(`${rate}%`);
}

function getMutationRate() {
    return int(select('#mutationRate').value()) / 100;
}

function initFitnessChart() {
    let ctx = document.getElementById('fitnessChart').getContext('2d');
    fitnessChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Average Fitness',
                data: [],
                borderColor: 'rgb(59, 130, 246)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1
                }
            }
        }
    });
}

function updateFitnessChart() {
    fitnessChart.data.labels = Array.from({ length: fitnessHistory.length }, (_, i) => i + 1);
    fitnessChart.data.datasets[0].data = fitnessHistory;
    fitnessChart.update();
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    updateChartTheme();
}

function updateChartTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    fitnessChart.options.scales.y.grid.color = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    fitnessChart.options.scales.x.grid.color = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    fitnessChart.options.scales.y.ticks.color = isDark ? '#fff' : '#666';
    fitnessChart.options.scales.x.ticks.color = isDark ? '#fff' : '#666';
    fitnessChart.update();
}
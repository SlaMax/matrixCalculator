function generateMatrix(isRandom) {
    const n = parseInt(document.getElementById('matrix-size').value);
    const container = document.getElementById('matrix-container');
    container.innerHTML = '';

    if (n <= 0 || isNaN(n)) {
        alert('Please enter a valid matrix dimension.');
        return;
    }

    const table = document.createElement('table');
    const matrix = [];

    for (let i = 0; i < n; i++) {
        const row = document.createElement('tr');
        matrix[i] = [];
        for (let j = 0; j < n; j++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.placeholder = `A[${i}][${j}]`;
            input.style.width = '100%';

            if (isRandom) {
                const randomValue = Math.floor(Math.random() * 21) - 10; 
                input.value = randomValue;
            }

            cell.appendChild(input);
            row.appendChild(cell);
            matrix[i][j] = isRandom ? input.value : null;
        }
        table.appendChild(row);
    }

    container.appendChild(table);

    const calculateButton = document.getElementById('calculate-button');
    calculateButton.style.display = 'block';
    calculateButton.onclick = () => calculateResults(n); 
}



function calculateResults(n) {
    const inputs = document.querySelectorAll('#matrix-container input');
    const matrix = [];

    for (let i = 0; i < n; i++) {
        matrix[i] = [];
        for (let j = 0; j < n; j++) {
            const value = parseFloat(inputs[i * n + j].value) || 0;
            matrix[i][j] = value;
        }
    }

    const determinant = computeDeterminant(matrix, n);
    const trace = calculateTrace(matrix, n);
    const norm = calculateNorm(matrix, n);
    const transpose = transposeMatrix(matrix, n); 
    const rank=calculateRank(matrix,n);

    let transposeHTML='<p>Transpose of the matrix:</p>'
    transposeHTML += '<table border="1" style="border-collapse: collapse; text-align: center;">';
    for (let i = 0; i < n; i++) {
        transposeHTML += '<tr>';
        for (let j = 0; j < n; j++) {
            transposeHTML += `<td>${transpose[i][j]}</td>`;
        }
        transposeHTML += '</tr>';
    }
    transposeHTML += '</table>';

    const inverse = inverseMatrix(matrix, n);
    let inverseHTML = '<p>Inverse matrix:</p>';
    if (inverse) {
        inverseHTML += '<table border="1" style="border-collapse: collapse; text-align: center;">';
        for (let i = 0; i < n; i++) {
            inverseHTML += '<tr>';
            for (let j = 0; j < n; j++) {
                inverseHTML += `<td>${inverse[i][j].toFixed(3)}</td>`;
            }
            inverseHTML += '</tr>';
        }
        inverseHTML += '</table>';
    } else {
        inverseHTML = '<p>Inverse matrix does not exist (determinant is zero).</p>';
    }


    const resultContainer = document.getElementById('result-container');
    resultContainer.style.display = 'block';
    resultContainer.innerHTML = `
        <p>The determinant of the matrix is: ${determinant.toFixed(3)}</p>
        <p>The trace of the matrix is: ${trace}</p>
        <p>The 2-norm of the matrix is: ${norm.toFixed(3)}</p>
        <p>The rank of matrix is : ${rank.toFixed(3)}</p>
        ${transposeHTML}
        ${inverseHTML}
    `;
}



function computeDeterminant(matrix, n) {
    const clonedMatrix = matrix.map(row => [...row]); 
    for (let i = 0; i < n - 1; i++) {
        if (clonedMatrix[i][i] === 0) {
            let swapRow = -1;
            for (let j = i + 1; j < n; j++) {
                if (clonedMatrix[j][i] !== 0) {
                    swapRow = j;
                    break;
                }
            }
            if (swapRow !== -1) {
                [clonedMatrix[i], clonedMatrix[swapRow]] = [clonedMatrix[swapRow], clonedMatrix[i]];
            } else {
                return 0;
            }
        }
        for (let j = i + 1; j < n; j++) {
            const ratio = clonedMatrix[j][i] / clonedMatrix[i][i];
            for (let k = i; k < n; k++) {
                clonedMatrix[j][k] -= ratio * clonedMatrix[i][k];
            }
        }
    }

    let det=1;
    for(let i= 0 ; i < n ; i++){
        det *= clonedMatrix[i][i];
    }
    return det;
}

function calculateTrace(matrix, n) {
    let trace = 0;
    for (let i = 0; i < n; i++) {
        trace += matrix[i][i]; 
    }
        return trace;
}


function calculateNorm(matrix, n) {
    let sumOfSquares = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            sumOfSquares += Math.pow(matrix[i][j], 2); 
        }
    }
    const norm = Math.sqrt(sumOfSquares);
    return norm;
}


function transposeMatrix(matrix) {
    let transposed = [];

    for (let i = 0; i < matrix[0].length; i++) {
        transposed[i] = [];
        for (let j = 0; j < matrix.length; j++) {
            transposed[i][j] = matrix[j][i];
        }
    }

    return transposed;
}



function inverseMatrix(matrix, n) {
    const det = computeDeterminant(matrix, n);
    if (det === 0) {
        alert('Matrix does not have invers, determinant is 0.');
        return null;
    }

    const adjugate = [];
    for (let i = 0; i < n; i++) {
        adjugate[i] = [];
        for (let j = 0; j < n; j++) {
            const subMatrix = matrix
                .filter((_, row) => row !== i)
                .map(row => row.filter((_, col) => col !== j));
            const minor = computeDeterminant(subMatrix, n - 1);
            adjugate[i][j] = ((i + j) % 2 === 0 ? 1 : -1) * minor;
        }
    }

    const transposedAdjugate = transposeMatrix(adjugate, n);
    return transposedAdjugate.map(row => row.map(value => value / det));
}




function calculateRank(matrix, n) {
    const clonedMatrix = matrix.map(row => [...row]);
    let rank = n;

    for (let row = 0; row < rank; row++) {
        if (clonedMatrix[row][row] !== 0) {
            for (let col = 0; col < n; col++) {
                if (col !== row) {
                    const ratio = clonedMatrix[col][row] / clonedMatrix[row][row];
                    for (let i = 0; i < rank; i++) {
                        clonedMatrix[col][i] -= ratio * clonedMatrix[row][i];
                    }
                }
            }
        } else {
            let reduce = true;
            for (let i = row + 1; i < n; i++) {
                if (clonedMatrix[i][row] !== 0) {
                    [clonedMatrix[row], clonedMatrix[i]] = [clonedMatrix[i], clonedMatrix[row]];
                    reduce = false;
                    break;
                }
            }

            if (reduce) {
                rank--;
                for (let i = 0; i < n; i++) {
                    clonedMatrix[i][row] = clonedMatrix[i][rank];
                }
            }
            row--;
        }
    }
    return rank;
}








function generateMatrices(isRandom) {
    const n = parseInt(document.getElementById('matrix-size').value);
    const container = document.getElementById('matrix-container');
    container.innerHTML = '';

    if (n <= 0 || isNaN(n)) {
        alert('Please enter a valid matrix dimension.');
        return;
    }

    const matrices = ['Matrix A', 'Matrix B'];

    matrices.forEach(matrixName => {
        const title = document.createElement('h3');
        title.innerText = matrixName;
        container.appendChild(title);

        const table = document.createElement('table');
        for (let i = 0; i < n; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < n; j++) {
                const cell = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'number';
                input.placeholder = `${matrixName}[${i}][${j}]`;
                input.style.width = '100%';

                if (isRandom) {
                    input.value = Math.floor(Math.random() * 21) - 10; 
                }

                cell.appendChild(input);
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        container.appendChild(table);
    });

    document.getElementById('calculate-addition').style.display = 'inline-block';
    document.getElementById('calculate-subtraction').style.display = 'inline-block';
    document.getElementById('calculate-multiplication').style.display = 'inline-block';
}


function calculateMatrix(operation,n) {
    const inputs = document.querySelectorAll('#matrix-container input'); 
    const matrixA = [];
    const matrixB = [];

    for (let i = 0; i < n; i++) {
        matrixA[i] = [];
        matrixB[i] = [];
        for (let j = 0; j < n; j++) {
            const valueA = parseFloat(inputs[i * n + j].value) || 0;
            const valueB = parseFloat(inputs[n * n + i * n + j].value) || 0;
            matrixA[i][j] = valueA;
            matrixB[i][j] = valueB;
        }
    }

    let resultMatrix;

    if (operation === 'add') {
        resultMatrix = addMatrices(matrixA, matrixB, n);
    } else if (operation === 'subtract') {
        resultMatrix = subtractMatrices(matrixA, matrixB, n);
    } else if (operation === 'multiply') {
        resultMatrix = multiplyMatrices(matrixA, matrixB, n);
    }

    displayResult(resultMatrix, n);
}


function displayResult(matrix, n) {
    const resultContainer = document.getElementById('result-container');
    resultContainer.style.display = 'block';
    resultContainer.innerHTML = '<h3>Result Matrix:</h3>';

    const table = document.createElement('table');
    for (let i = 0; i < n; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < n; j++) {
            const cell = document.createElement('td');
            cell.innerText = matrix[i][j].toFixed(2); 
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    resultContainer.appendChild(table);
}






function addMatrices(matrixA, matrixB, n) {
    const result = [];
    for (let i = 0; i < n; i++) {
        result[i] = [];
        for (let j = 0; j < n; j++) {
            result[i][j] = matrixA[i][j] + matrixB[i][j];
        }
    }
    return result;
}

function subtractMatrices(matrixA, matrixB, n) {
    const result = [];
    for (let i = 0; i < n; i++) {
        result[i] = [];
        for (let j = 0; j < n; j++) {
            result[i][j] = matrixA[i][j] - matrixB[i][j];
        }
    }
    return result;
}

function multiplyMatrices(matrixA, matrixB, n) {
    const result = [];
    for (let i = 0; i < n; i++) {
        result[i] = [];
        for (let j = 0; j < n; j++) {
            result[i][j] = 0;
            for (let k = 0; k < n; k++) {
                result[i][j] += matrixA[i][k] * matrixB[k][j];
            }
        }
    }
    return result;
}









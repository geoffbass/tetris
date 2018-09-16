import { render } from 'react-dom';
import React, { Component } from 'react';

import { i0, i90, i180, i270 } from './tetrominos/i.js';
import { j0, j90, j180, j270 } from './tetrominos/j.js';
import { l0, l90, l180, l270 } from './tetrominos/l.js';
import { o0 } from './tetrominos/o.js';
import { s0, s90, s180, s270 } from './tetrominos/s.js';
import { t0, t90, t180, t270 } from './tetrominos/t.js';
import { z0, z90, z180, z270 } from './tetrominos/z.js';

const initialTetrominos = [i0, j0, l0, o0, s0, t0, z0];
const randomTetromino = () =>
  initialTetrominos[Math.floor(Math.random() * initialTetrominos.length)];

const rotationsMap = new Map();

rotationsMap.set(i0, i90);
rotationsMap.set(i90, i180);
rotationsMap.set(i180, i270);
rotationsMap.set(i270, i0);

rotationsMap.set(j0, j90);
rotationsMap.set(j90, j180);
rotationsMap.set(j180, j270);
rotationsMap.set(j270, j0);

rotationsMap.set(l0, l90);
rotationsMap.set(l90, l180);
rotationsMap.set(l180, l270);
rotationsMap.set(l270, l0);

rotationsMap.set(o0, o0);

rotationsMap.set(s0, s90);
rotationsMap.set(s90, s180);
rotationsMap.set(s180, s270);
rotationsMap.set(s270, s0);

rotationsMap.set(t0, t90);
rotationsMap.set(t90, t180);
rotationsMap.set(t180, t270);
rotationsMap.set(t270, t0);

rotationsMap.set(z0, z90);
rotationsMap.set(z90, z180);
rotationsMap.set(z180, z270);
rotationsMap.set(z270, z0);

const tetrominoCoords = (center, diffs) => {
  const coords = new Set();
  diffs.forEach(diff =>
    coords.add({ row: center.row + diff.row, col: center.col + diff.col })
  );
  return coords;
};

const Well = ({ matrix }) => (
  <table>
    <tbody>
      {matrix.map((row, rowNum) => (
        <Row row={row} key={rowNum} />
      ))}
    </tbody>
  </table>
);

const Row = ({ row }) => (
  <tr>
    {row.map((cell, cellNum) => (
      <Cell cell={cell} key={cellNum} />
    ))}
  </tr>
);

const Cell = ({ cell }) => (
  <td className={`block ${cell.filled ? 'filled' : 'empty'}`} />
);

const emptyMatrix = Array(18).fill([
  ...Array(10).fill(
    Object.assign(
      {},
      {
        filled: false,
      }
    )
  ),
]);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: { row: 2, col: 4 },
      diffs: randomTetromino(),
      foundation: emptyMatrix,
      matrix: emptyMatrix,
    };
    this.calculateMatrix = this.calculateMatrix.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    setInterval(() => {
      const nextCenter = {
        row: this.state.center.row + 1,
        col: this.state.center.col,
      };
      const nextCoords = tetrominoCoords(nextCenter, this.state.diffs);

      let collidedWithFoundation = false;
      nextCoords.forEach(pair => {
        if (
          !this.state.foundation[pair.row] ||
          this.state.foundation[pair.row][pair.col].filled
        ) {
          collidedWithFoundation = true;
        }
      });

      if (collidedWithFoundation) {
        this.setState(prevState => ({
          center: { row: 2, col: 4 },
          diffs: randomTetromino(),
          foundation: prevState.matrix,
        }));
      } else {
        const nextMatrix = this.calculateMatrix(nextCoords);
        this.setState({
          center: nextCenter,
          matrix: nextMatrix,
        });
      }
    }, 200);

    document.addEventListener('keypress', this.handleKeyPress);
  }

  calculateMatrix(coords) {
    const nextMatrix = this.state.foundation.map(row => [...row]);

    coords.forEach(pair => {
      if (nextMatrix[pair.row]) {
        nextMatrix[pair.row][pair.col] = { filled: true };
      }
    });

    return nextMatrix;
  }

  handleKeyPress(keyPressEvent) {
    const { key } = keyPressEvent;
    let nextColDiff = 0;
    let tetrominoDiffs = this.state.diffs;
    if (key === 'ArrowLeft') {
      nextColDiff = -1;
    } else if (key === 'ArrowRight') {
      nextColDiff = 1;
    } else if (key === 'ArrowUp') {
      tetrominoDiffs = rotationsMap.get(tetrominoDiffs);
    }
    const nextCenter = {
      row: this.state.center.row,
      col: this.state.center.col + nextColDiff,
    };

    const nextCoords = tetrominoCoords(nextCenter, tetrominoDiffs);

    let collided = false;
    nextCoords.forEach(pair => {
      if (
        pair.col < 0 ||
        pair.col > 9 ||
        this.state.foundation[pair.row][pair.col].filled
      ) {
        collided = true;
      }
    });

    if (!collided) {
      const nextMatrix = this.calculateMatrix(nextCoords);

      this.setState({
        center: nextCenter,
        diffs: tetrominoDiffs,
        matrix: nextMatrix,
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.handleKeyPress);
  }

  render() {
    return <Well matrix={this.state.matrix} />;
  }
}

render(<App />, document.getElementById('app'));

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const source = fs.readFileSync(path.join(root, 'uml', 'app.js'), 'utf8');

function loadQuestionBank() {
  const start = source.indexOf('const QUESTION_BANK = ');
  const marker = '\n  ];\n\n  const idToIndex';
  const end = source.indexOf(marker, start);
  assert.notEqual(start, -1, 'No se encontró QUESTION_BANK');
  assert.notEqual(end, -1, 'No se encontró el final de QUESTION_BANK');
  const declaration = source.slice(start, end + 5).replace('const QUESTION_BANK =', 'return');
  return Function(declaration)();
}

const bank = loadQuestionBank();

test('el banco tiene variedad e IDs únicos', () => {
  assert.equal(bank.length, 88);
  assert.equal(new Set(bank.map((question) => question.id)).size, bank.length);
  const counts = Object.groupBy(bank, (question) => question.type);
  assert.equal(counts.single.length, 62);
  assert.equal(counts.multi.length, 14);
  assert.equal(counts.match.length, 9);
  assert.equal(counts.order.length, 3);
});

test('todas las respuestas apuntan a opciones válidas', () => {
  for (const question of bank) {
    assert.ok(question.explanation, `${question.id} no tiene explicación`);
    if (question.type === 'single' || question.type === 'multi') {
      assert.ok(question.answer.length > 0, `${question.id} no tiene respuesta`);
      for (const index of question.answer) {
        assert.ok(index >= 0 && index < question.options.length, `${question.id} tiene un índice inválido`);
      }
    } else if (question.type === 'match') {
      assert.deepEqual(Object.keys(question.answerMap), question.left, `${question.id} no cubre todos los conceptos`);
      for (const index of Object.values(question.answerMap)) {
        assert.ok(index >= 0 && index < question.right.length, `${question.id} tiene una relación inválida`);
      }
    } else if (question.type === 'order') {
      assert.deepEqual(new Set(question.items), new Set(question.answerOrder), `${question.id} usa elementos distintos`);
    } else {
      assert.fail(`Tipo desconocido en ${question.id}`);
    }
  }
});

test('el banco cubre los conceptos centrales del PDF', () => {
  const content = JSON.stringify(bank).toLowerCase();
  for (const term of [
    'lenguaje unificado de modelado',
    'diagramas estructurales',
    'diagramas de comportamiento',
    'casos de uso',
    '<<include>>',
    '<<extend>>',
    'visibilidad',
    'agregación',
    'composición',
    'multiplicidad',
    'tabla de decisión',
    '2⁴ = 16',
    '$120.000'
  ]) {
    assert.ok(content.includes(term), `Falta cubrir: ${term}`);
  }
});

test('la variante usa recursos y almacenamiento propios', () => {
  const html = fs.readFileSync(path.join(root, 'uml', 'index.html'), 'utf8');
  assert.match(html, /<script src="app\.js"><\/script>/);
  assert.match(html, /<link rel="stylesheet" href="styles\.css">/);
  assert.match(source, /uml_quiz_stats_/);
  assert.match(source, /uml_quiz_fallback_v1/);
  assert.doesNotMatch(html, /Volver al quiz de alimentos/);
});

test('las preguntas visuales incluyen notación UML legible', () => {
  const visuals = bank.filter((question) => question.visual || question.visualOptions);
  assert.ok(visuals.length >= 12);
  const content = JSON.stringify(visuals);
  for (const symbol of ['◆', '◇', '0..*', '<<include>>', '<<extend>>']) {
    assert.ok(content.includes(symbol), `Falta la notación visual: ${symbol}`);
  }
});

var nextMove = 'white';

interact('.piece')
    .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
            restriction: ".chess-board",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: true,

        // call this function on every dragmove event
        onmove: dragMoveListener
    });

function dragMoveListener (event) {
    var target = event.target,
    // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

    // update the position attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

window.dragMoveListener = dragMoveListener;

interact('.square').dropzone({
    // Require a 50% element overlap for a drop to be possible
    overlap: 0.50,

    // listen for drop related events:
    ondragenter: function (event) {
        event.target.classList.add('drop-target');
    },
    ondragleave: function (event) {
        event.target.classList.remove('drop-target');
    },
    ondrop: function (event) {
        var draggableElement = event.relatedTarget,
            dropzoneElement = event.target,
            from = draggableElement.parentElement.id,
            to = dropzoneElement.id;

        if (draggableElement.classList.contains(nextMove)) {
            if (dropzoneElement.hasChildNodes()) {
                dropzoneElement.removeChild(dropzoneElement.childNodes[0]);
                recordMove(draggableElement, from, to, true);
            } else {
                recordMove(draggableElement, from, to, false);
            }
            dropzoneElement.appendChild(event.relatedTarget);
            nextMove = (nextMove === 'white') ? 'black' : 'white';
        }
    },
    ondropdeactivate: function (event) {
        var draggableElement = event.relatedTarget,
            dropzoneElement = event.target;

        draggableElement.style.transform = '';

        // update the position attributes
        draggableElement.removeAttribute('data-x');
        draggableElement.removeAttribute('data-y');

        dropzoneElement.classList.remove('drop-target');
    }
});

function recordMove(piece, from, to, isCapture) {
    var table = document.getElementById('moves').getElementsByTagName('tbody')[0];
    var row, cell;
    var capture = isCapture ? 'x' : ' ' ;

    if (getColor(piece) === 'white') {
        row   = table.insertRow(table.rows.length);

        cell  = row.insertCell(0);
        cell.appendChild(document.createTextNode(table.rows.length));
    } else {
        row = table.rows[table.rows.length - 1]
    }

    cell  = row.insertCell(row.cells.length);
    cell.appendChild(document.createTextNode(getPiece(piece) + ' ' + from + capture + to));
}

function capture(piece, targetSquare) {

}

function getColor(piece) {
    if (piece.classList.contains('white')) {
        return 'white';
    }

    if (piece.classList.contains('black')) {
        return 'black';
    }
}

function getPiece(piece) {
    if (piece.classList.contains('rook')) {
        return 'R';
    }

    if (piece.classList.contains('knight')) {
        return 'N';
    }

    if (piece.classList.contains('bishop')) {
        return 'B';
    }

    if (piece.classList.contains('queen')) {
        return 'Q';
    }

    if (piece.classList.contains('king')) {
        return 'K';
    }

    if (piece.classList.contains('pawn')) {
        return '';
    }
}
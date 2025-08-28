(define-constant MAX-EVENTS u100)

;; Each access event has:
;; event-id, session-id, event-type, timestamp, photo-hash
(define-data-var access-events (list MAX-EVENTS
    (tuple (event-id uint)
           (session-id (string-ascii 50))
           (event-type (string-ascii 10))
           (timestamp uint)
           (photo-hash (string-ascii 64)))
) (list))

(define-data-var current-counter uint u0)

(define-public (log-entry (session-id (string-ascii 50)) (event-type (string-ascii 10)) (photo-hash (string-ascii 64)))
    (begin
        ;; increment counter
        (var-set current-counter (+ (var-get current-counter) u1))

        ;; create new tuple
        (let ((new-event (tuple
            (event-id (var-get current-counter))
            (session-id session-id)
            (event-type event-type)
            (timestamp u0)
            (photo-hash photo-hash)
        )))
        
        ;; append to list
        (var-set access-events (append (var-get access-events) (list new-event)))
        
        ;; return success
        (ok new-event)
        )
    )
)

;; Get all events
(define-read-only (get-events)
    (ok (var-get access-events))
)

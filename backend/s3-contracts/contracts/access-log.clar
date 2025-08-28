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

;; Helper function to check if list is full
(define-private (is-list-full)
    (>= (len (var-get access-events)) MAX-EVENTS)
)

;; Helper function to validate event type
(define-private (is-valid-event-type (event-type (string-ascii 10)))
    (or (is-eq event-type "ENTRY") (is-eq event-type "EXIT"))
)

(define-public (log-entry (session-id (string-ascii 50)) (event-type (string-ascii 10)) (photo-hash (string-ascii 64)))
    (begin
        ;; Validate inputs
        (asserts! (not (is-eq session-id "")) (err u1)) ;; Empty session ID
        (asserts! (not (is-eq photo-hash "")) (err u2)) ;; Empty photo hash
        (asserts! (is-valid-event-type event-type) (err u3)) ;; Invalid event type
        
        ;; Check if list is full
        (asserts! (not (is-list-full)) (err u4)) ;; List full
        
        ;; increment counter
        (var-set current-counter (+ (var-get current-counter) u1))

        ;; create new tuple with current counter as timestamp
        (let ((new-event (tuple
            (event-id (var-get current-counter))
            (session-id session-id)
            (event-type event-type)
            (timestamp (var-get current-counter))
            (photo-hash photo-hash)
        )))
        
        ;; append to list
        (var-set access-events (append (var-get access-events) (list new-event)))
        
        ;; return success with event details
        (ok new-event)
        )
    )
)

;; Get all events
(define-read-only (get-events)
    (ok (var-get access-events))
)

;; Get event count
(define-read-only (get-event-count)
    (ok (len (var-get access-events)))
)

;; Get current counter
(define-read-only (get-current-counter)
    (ok (var-get current-counter))
)

;; Get events by type
(define-read-only (get-events-by-type (event-type (string-ascii 10)))
    (let ((events (var-get access-events)))
        (filter-events events event-type)
    )
)

;; Helper function to filter events by type
(define-private (filter-events (events (list MAX-EVENTS
    (tuple (event-id uint)
           (session-id (string-ascii 50))
           (event-type (string-ascii 10))
           (timestamp uint)
           (photo-hash (string-ascii 64)))) (target-type (string-ascii 10)))
    (filter is-event-type events target-type)
)

;; Helper function to check if event matches type
(define-private (is-event-type (event (tuple (event-id uint)
                                            (session-id (string-ascii 50))
                                            (event-type (string-ascii 10))
                                            (timestamp uint)
                                            (photo-hash (string-ascii 64)))) (target-type (string-ascii 10)))
    (is-eq (get event-type event) target-type)
)

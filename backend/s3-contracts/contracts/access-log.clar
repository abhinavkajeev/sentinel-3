(define-constant MAX-EVENTS u100)

;; Each access event tuple type
(define-data-var access-events 
  (list 100 {
    event-id: uint,
    session-id: (string-ascii 50),
    event-type: (string-ascii 10),
    timestamp: uint,
    photo-hash: (string-ascii 64)
  }) 
  (list))

(define-data-var current-counter uint u0)

;; Helper function to check if list is full
(define-private (is-list-full)
  (>= (len (var-get access-events)) MAX-EVENTS)
)

;; Helper function to validate event type
(define-private (is-valid-event-type (event-type (string-ascii 10)))
  (or (is-eq event-type "ENTRY") (is-eq event-type "EXIT"))
)

(define-public (log-entry
    (session-id (string-ascii 50))
    (event-type (string-ascii 10))
    (photo-hash (string-ascii 64))
  )
  (begin
    ;; Validate inputs
    (asserts! (not (is-eq session-id "")) (err u1)) ;; Empty session ID
    (asserts! (not (is-eq photo-hash "")) (err u2)) ;; Empty photo hash
    (asserts! (is-valid-event-type event-type) (err u3)) ;; Invalid event type

    ;; Check if list is full
    (asserts! (not (is-list-full)) (err u4)) ;; List full

    ;; Increment counter
    (var-set current-counter (+ (var-get current-counter) u1))

    ;; Create new event tuple
    (let ((new-event {
        event-id: (var-get current-counter),
        session-id: session-id,
        event-type: event-type,
        timestamp: u0,
        photo-hash: photo-hash
      }))
      
      ;; Add event to list - more explicit type handling
      (let ((current-events (var-get access-events))
            (event-to-add (list new-event)))
        (match (as-max-len? (concat current-events event-to-add) u100)
          success-list (begin 
                        (var-set access-events success-list)
                        (ok new-event))
          (err u5)) ;; Failed to append
      )
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

;; Get current counter value
(define-read-only (get-current-counter)
  (ok (var-get current-counter))
)

;; Get latest event
(define-read-only (get-latest-event)
  (let ((events (var-get access-events)))
    (if (> (len events) u0)
      (ok (some (unwrap-panic (element-at events (- (len events) u1)))))
      (ok none))))

;; Get events by session ID (simplified - returns all for now due to Clarity limitations)
(define-read-only (get-events-by-session (session-id (string-ascii 50)))
  (ok (var-get access-events))
)

;; Clear all events (admin function)
(define-public (clear-events)
  (begin
    (var-set access-events (list))
    (var-set current-counter u0)
    (ok true)
  )
)
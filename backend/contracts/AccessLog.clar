;; Access Log Smart Contract for Building Security
;; Built with Clarity on Stacks blockchain

(define-constant contract-owner (as-contract tx-sender))

;; Data structure for access events
(define-data-var access-events (list 1000 (tuple 
  (event-id uint)
  (session-id (string-ascii 50))
  (event-type (string-ascii 20))
  (timestamp uint)
  (photo-hash (string-ascii 64))
)) (list)

;; Counter for unique event IDs
(define-data-var event-counter uint u0)

;; Map to store photo hashes by event ID for quick lookup
(define-map photo-hash-map uint (string-ascii 64))

;; Map to store person details
;; person-details removed; no pre-registration

;; Error codes
(define-constant ERR-UNAUTHORIZED (err u1001))
(define-constant ERR-INVALID-EVENT-TYPE (err u1002))
(define-constant ERR-PERSON-NOT-FOUND (err u1003))
(define-constant ERR-EVENT-LIMIT-REACHED (err u1004))

;; Public functions

;; person registration removed

;; Log entry event
(define-public (log-entry
  (session-id (string-ascii 50))
  (photo-hash (string-ascii 64))
)
  (begin
    ;; Check event limit
    (if (>= (len (var-get access-events)) u1000)
      (err ERR-EVENT-LIMIT-REACHED)
      (let ((current-counter (var-get event-counter)))
        (var-set access-events (append (var-get access-events) (list (tuple
          (event-id current-counter)
          (session-id session-id)
          (event-type "ENTRY")
          (timestamp (block-height))
          (photo-hash photo-hash)
        ))))
        (map-set photo-hash-map current-counter photo-hash)
        (var-set event-counter (+ current-counter u1))
        (ok current-counter)
      )
    )
  )
)

;; Log exit event
(define-public (log-exit
  (session-id (string-ascii 50))
  (photo-hash (string-ascii 64))
)
  (begin
    (if (>= (len (var-get access-events)) u1000)
      (err ERR-EVENT-LIMIT-REACHED)
      (let ((current-counter (var-get event-counter)))
        (var-set access-events (append (var-get access-events) (list (tuple
          (event-id current-counter)
          (session-id session-id)
          (event-type "EXIT")
          (timestamp (block-height))
          (photo-hash photo-hash)
        ))))
        (map-set photo-hash-map current-counter photo-hash)
        (var-set event-counter (+ current-counter u1))
        (ok current-counter)
      )
    )
  )
)

;; Get photo hash by event ID
(define-read-only (get-photo-hash (event-id uint))
  (map-get? photo-hash-map event-id)
)

;; Get all events for a person
(define-read-only (get-session-events (session-id (string-ascii 50)))
  (filter access-events (lambda (event) 
    (is-eq (get session-id event) session-id)
  ))
)

;; Get recent events (last N events)
(define-read-only (get-recent-events (count uint))
  (if (<= count u0)
    (list)
    (let ((all-events (var-get access-events)))
      (if (<= (len all-events) count)
        all-events
        (slice all-events (- (len all-events) count) (len all-events))
      )
    )
  )
)

;; Get event by ID
(define-read-only (get-event (event-id uint))
  (find access-events (lambda (event) 
    (is-eq (get event-id event) event-id)
  ))
)

;; person management removed

;; Get person details
;; get-person removed

;; Get total event count
(define-read-only (get-total-events)
  (var-get event-counter)
)

;; Get events by type
(define-read-only (get-events-by-type (event-type (string-ascii 20)))
  (filter access-events (lambda (event) 
    (is-eq (get event-type event) event-type)
  ))
)

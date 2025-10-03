document.addEventListener('DOMContentLoaded', function() {
            const mailIcon = document.getElementById('mailIcon');
            const swipeLabel = document.getElementById('swipeLabel');
            const swipeProgress = document.getElementById('swipeProgress');
            const letterContent = document.getElementById('letterContent');
            const instructions = document.getElementById('instructions');
            const tearEffect = document.getElementById('tearEffect');
            const container = document.querySelector('.container');
            
            // Show swipe hint after a delay
            setTimeout(() => {
                swipeLabel.style.opacity = '1';
            }, 2000);
            
            // Handle the mail icon interaction
            let startX = 0;
            let currentX = 0;
            let isDragging = false;
            let maxSwipeDistance = 0;
            
            // Calculate max swipe distance
            function calculateMaxSwipe() {
                const trackWidth = document.querySelector('.swipe-track').offsetWidth;
                const iconWidth = mailIcon.offsetWidth;
                maxSwipeDistance = trackWidth - iconWidth + 30;
            }
            
            window.addEventListener('resize', calculateMaxSwipe);
            calculateMaxSwipe();
            
            mailIcon.addEventListener('mousedown', startDrag);
            mailIcon.addEventListener('touchstart', startDrag);
            
            function startDrag(e) {
                e.preventDefault();
                isDragging = true;
                
                // Get initial position
                startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
                
                // Add event listeners for dragging
                document.addEventListener('mousemove', onDrag);
                document.addEventListener('touchmove', onDrag);
                document.addEventListener('mouseup', stopDrag);
                document.addEventListener('touchend', stopDrag);
                
                // Hide the swipe label
                swipeLabel.style.opacity = '0';
                
                // Add active style
                mailIcon.style.transform = 'translateY(-50%) scale(1.1)';
                mailIcon.style.boxShadow = '0 10px 30px rgba(195, 107, 107, 0.5)';
            }
            
            function onDrag(e) {
                if (!isDragging) return;
                
                // Get current position
                currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
                
                // Calculate distance dragged
                const deltaX = currentX - startX;
                
                // Limit dragging to the track
                const limitedDeltaX = Math.min(Math.max(deltaX, 0), maxSwipeDistance);
                
                // Move the mail icon
                mailIcon.style.transform = `translate(calc(-50% + ${limitedDeltaX}px), -50%) scale(1.1)`;
                
                // Update progress bar
                const progressPercent = (limitedDeltaX / maxSwipeDistance) * 100;
                swipeProgress.style.width = `${progressPercent}%`;
                
                // Show tear effect when halfway
                if (progressPercent > 30) {
                    tearEffect.style.display = 'block';
                } else {
                    tearEffect.style.display = 'none';
                }
                
                // If dragged enough to the right, open the letter
                if (limitedDeltaX >= maxSwipeDistance - 5) {
                    openLetter();
                    stopDrag();
                }
            }
            
            function stopDrag() {
                if (!isDragging) return;
                isDragging = false;
                
                // Hide tear effect
                tearEffect.style.display = 'none';
                
                // Animate mail icon back to start
                mailIcon.style.transform = 'translateY(-50%)';
                mailIcon.style.boxShadow = '0 6px 20px rgba(195, 107, 107, 0.35)';
                
                // Animate progress bar reset
                swipeProgress.style.width = '0';
                
                // Remove event listeners
                document.removeEventListener('mousemove', onDrag);
                document.removeEventListener('touchmove', onDrag);
                document.removeEventListener('mouseup', stopDrag);
                document.removeEventListener('touchend', stopDrag);
            }
            
            function createConfetti() {
                const colors = ['#ff6b6b', '#51cf66', '#ffd43b', '#339af0', '#9775fa'];
                
                for (let i = 0; i < 50; i++) {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + 'vw';
                    confetti.style.width = Math.random() * 15 + 10 + 'px';
                    confetti.style.height = Math.random() * 15 + 10 + 'px';
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                    
                    document.body.appendChild(confetti);
                    
                    // Animation
                    const animationDuration = Math.random() * 3 + 2;
                    const animationDelay = Math.random() * 2;
                    
                    confetti.style.animation = `
                        fall ${animationDuration}s linear ${animationDelay}s forwards,
                        sway ${animationDuration * 0.5}s ease-in-out ${animationDelay}s infinite
                    `;
                    
                    // Remove confetti after animation
                    setTimeout(() => {
                        confetti.remove();
                    }, (animationDuration + animationDelay) * 1000);
                }
            }
            
            function openLetter() {
                // Create confetti effect
                createConfetti();
                
                // Hide the envelope and show the letter
                document.querySelector('.envelope-back').style.display = 'none';
                letterContent.style.display = 'flex';
                
                // Apply unfolding animation to the letter
                letterContent.style.animation = 'unfoldLetter 1.2s ease forwards';
                
                // Animate content appearing with a delay
                setTimeout(() => {
                    const letterHeader = document.querySelector('.letter-header');
                    const letterBody = document.querySelector('.letter-body');
                    const signature = document.querySelector('.signature');
                    
                    letterHeader.style.animation = 'fadeInUp 0.8s ease forwards';
                    letterBody.style.animation = 'fadeInUp 0.8s ease 0.3s forwards';
                    signature.style.animation = 'fadeInUp 0.8s ease 0.6s forwards';
                }, 600);
                
                // Update instructions
                instructions.innerHTML = "<p>Letter opened successfully! Scroll to read the content.</p>";
            }
            
            // Also allow click to open for accessibility
            mailIcon.addEventListener('click', function() {
                if (!isDragging) {
                    openLetter();
                }
            });
        });
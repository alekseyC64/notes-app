import random
import string

punctuation = ['.', '?', '!', '...']


def randomseq(generator, min_length, max_length):
    return [
        generator() for _ in xrange(random.randint(min_length, max_length))]


def random_word(max_length=15, symbols=string.lowercase):
    """Generate a random word of given length."""
    return ''.join(randomseq(lambda: random.choice(symbols), 1, max_length))


def random_title(word_count=3):
    """Generate a random short sequence of words of given length."""
    return ' '.join(randomseq(random_word, 1, word_count)).capitalize()


def random_sentence(word_count=10):
    """Generate a random long sequence of words ending with a punctuation
        symbol."""
    return ' '.join(randomseq(random_word, 1, word_count)).capitalize() + \
        random.choice(punctuation)


def random_text(sentence_count=12):
    """Generate a random note text."""
    return ' '.join(randomseq(random_sentence, 1, sentence_count))

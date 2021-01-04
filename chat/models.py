from django.db import models



class Chat(models.Model):
    user = models.ForeignKey('customuser.User', blank=False, null=True, on_delete=models.CASCADE)


class Message(models.Model):
    chat = models.ForeignKey(Chat, blank=False, null=True, on_delete=models.CASCADE)
    message = models.TextField('Текст', blank=False, null=True)
    isRead = models.BooleanField('Прочитано ?', default=False)
    isUserMessage = models.BooleanField('От пользователя?', default=False)
    created = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    def __str__(self):
        return 'Сообщение от {} '.format(self.chat.user.name)

    class Meta:
        verbose_name = "Сообщение"
        verbose_name_plural = "Сообщения"

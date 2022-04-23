from django.shortcuts import render

from django.http import HttpResponse


def index(request, id):
    return HttpResponse("Hello, world. You're id is {}".format(id))
